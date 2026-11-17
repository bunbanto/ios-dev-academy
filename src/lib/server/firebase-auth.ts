import { createVerify, X509Certificate } from 'node:crypto';
import { ADMIN_EMAIL, normalizeEmail } from '../access';

const GOOGLE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

export interface VerifiedServerUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
  isLocalDevFallback?: boolean;
}

export class ServerAuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = 'ServerAuthError';
    this.status = status;
  }
}

interface CertCache {
  certs: Record<string, string>;
  expiresAt: number;
}

const globalForAuth = globalThis as typeof globalThis & {
  __swiftlabFirebaseCertCache?: CertCache;
};

function decodeBase64UrlJson<T>(segment: string): T {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const raw = Buffer.from(padded, 'base64').toString('utf8');
  return JSON.parse(raw) as T;
}

function decodeBase64UrlBuffer(segment: string): Buffer {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}

function parseMaxAgeSeconds(cacheControl: string | null): number {
  if (!cacheControl) return 3600;
  const match = cacheControl.match(/max-age=(\d+)/i);
  const parsed = match ? Number(match[1]) : 3600;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3600;
}

async function fetchGooglePublicCerts(
  forceRefresh = false,
  fetchFn: typeof fetch = fetch,
): Promise<Record<string, string>> {
  const cached = globalForAuth.__swiftlabFirebaseCertCache;
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
    return cached.certs;
  }

  const response = await fetchFn(GOOGLE_CERTS_URL, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new ServerAuthError(
      `Failed to fetch Firebase public keys (${response.status}).`,
      503,
    );
  }

  const certs = (await response.json()) as Record<string, string>;
  const maxAge = parseMaxAgeSeconds(response.headers.get('cache-control'));
  globalForAuth.__swiftlabFirebaseCertCache = {
    certs,
    expiresAt: Date.now() + maxAge * 1000,
  };
  return certs;
}

export async function verifyFirebaseIdToken(
  token: string,
  projectId: string,
  fetchFn: typeof fetch = fetch,
): Promise<VerifiedServerUser> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new ServerAuthError('Malformed Firebase ID token.', 401);
  }

  const [headerSegment, payloadSegment, signatureSegment] = parts;

  let header: { alg?: string; kid?: string };
  let payload: {
    aud?: string;
    iss?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    auth_time?: number;
    email?: string;
    email_verified?: boolean;
  };

  try {
    header = decodeBase64UrlJson(headerSegment);
    payload = decodeBase64UrlJson(payloadSegment);
  } catch {
    throw new ServerAuthError('Could not decode Firebase ID token.', 401);
  }

  if (header.alg !== 'RS256' || !header.kid) {
    throw new ServerAuthError('Invalid token signature algorithm or key id.', 401);
  }

  let certs = await fetchGooglePublicCerts(false, fetchFn);
  let pem = certs[header.kid];
  if (!pem) {
    certs = await fetchGooglePublicCerts(true, fetchFn);
    pem = certs[header.kid];
  }

  if (!pem) {
    throw new ServerAuthError('Unknown Firebase signing key.', 401);
  }

  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${headerSegment}.${payloadSegment}`);
  verifier.end();

  const signature = decodeBase64UrlBuffer(signatureSegment);
  let isValidSignature = false;
  try {
    const publicKey = new X509Certificate(pem).publicKey;
    isValidSignature = verifier.verify(publicKey, signature);
  } catch {
    isValidSignature = false;
  }

  if (!isValidSignature) {
    throw new ServerAuthError('Invalid Firebase ID token signature.', 401);
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId) {
    throw new ServerAuthError('Token audience does not match Firebase project.', 401);
  }
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new ServerAuthError('Token issuer does not match Firebase project.', 401);
  }
  if (typeof payload.sub !== 'string' || payload.sub.length === 0 || payload.sub.length > 128) {
    throw new ServerAuthError('Invalid token subject.', 401);
  }
  if (typeof payload.exp !== 'number' || payload.exp <= nowSeconds) {
    throw new ServerAuthError('Firebase ID token has expired. Please sign in again.', 401);
  }
  if (typeof payload.iat !== 'number' || payload.iat > nowSeconds + 300) {
    throw new ServerAuthError('Token issued-at timestamp is invalid.', 401);
  }
  if (typeof payload.auth_time === 'number' && payload.auth_time > nowSeconds + 300) {
    throw new ServerAuthError('Token auth_time timestamp is invalid.', 401);
  }

  const email = normalizeEmail(payload.email);
  return {
    uid: payload.sub,
    email,
    emailVerified: Boolean(payload.email_verified),
    isAdmin: email === ADMIN_EMAIL,
  };
}

export function isServerFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  return Boolean(
    apiKey &&
      projectId &&
      apiKey !== 'AIzaSyYourActualApiKeyHere' &&
      projectId !== 'your-project-id' &&
      projectId !== 'swiftlab-build',
  );
}

export async function authenticateApiRequest(request: Request): Promise<VerifiedServerUser> {
  const authHeader = request.headers.get('authorization') || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch?.[1]?.trim();

  if (!isServerFirebaseConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      return {
        uid: 'local-dev-user',
        email: 'local-dev@swiftlab.local',
        emailVerified: true,
        isAdmin: false,
        isLocalDevFallback: true,
      };
    }
    throw new ServerAuthError(
      'Firebase authentication is not configured on this server.',
      503,
    );
  }

  if (!token) {
    throw new ServerAuthError(
      'Authentication required. Please sign in to use AI code verification.',
      401,
    );
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  return verifyFirebaseIdToken(token, projectId);
}
