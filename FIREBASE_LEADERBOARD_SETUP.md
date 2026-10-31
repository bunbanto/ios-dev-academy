# Leaderboard setup

The leaderboard uses the Firebase project already configured for Google sign-in.

1. Create or enable a Cloud Firestore database in the Firebase Console.
2. Deploy the included rules from this repository with `firebase deploy --only firestore:rules`.
3. Keep the existing `NEXT_PUBLIC_FIREBASE_*` configuration in place.

Enable both Google and Email/Password providers under Firebase Authentication → Sign-in method. Players authenticated with either provider can submit quiz scores. Email sign-up sends a Firebase verification email; users can confirm the address from the sign-in dialog. The leaderboard stores a display name and avatar URL, total quiz points, number of completed rounds, and best round score. It does not store email addresses.

The email verification page uses Firebase's configured email template and authorized domains. Add the site's domain to Firebase Authentication → Settings → Authorized domains.
