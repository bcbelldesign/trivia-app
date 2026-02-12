# Deploy Trivia to a public URL

The app is ready to deploy. Follow these steps to get a public URL (e.g. on Vercel).

## Step 1: Push to GitHub

The project is already in Git with an initial commit. To push it to GitHub:

1. Create a **new repository** on [GitHub](https://github.com/new). Name it e.g. `trivia-app`. Do **not** initialize with a README (you already have one).
2. In your project folder, add the remote and push:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/trivia-app.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `trivia-app` with your GitHub username and repo name. If GitHub created the repo with a different default branch, use that branch name instead of `main`.

Your `.env.local` is not committed (it is in `.gitignore`). You will add the same env values in Vercel.

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New** → **Project** and **import** your Trivia APP repository.
3. Vercel will detect Next.js. Leave **Build Command** as `next build` and **Output Directory** as default.
4. **Environment variables:** Add each variable from your `.env.local` (same names and values):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   Apply to **Production** (and optionally Preview).
5. Click **Deploy**. When the build finishes, Vercel will show a URL like `https://trivia-app-xxxx.vercel.app`.
6. Share **/join** (e.g. `https://your-app.vercel.app/join`) with players and **/admin** with the host. The host should click **Start Lobby** before sharing the join link.

## Step 3: Allow the new domain in Firebase (if needed)

If the app loads on Vercel but Firestore requests fail (e.g. permission errors in the browser console), allow the Vercel domain:

1. Open [Firebase Console](https://console.firebase.google.com) → your project → **Project settings** (gear) → **General**.
2. Under **Your apps**, select your web app.
3. In [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**, open the **API key** used by your Firebase web app.
4. Under **Application restrictions**, if it is "HTTP referrers", add:
   - `https://*.vercel.app/*`
   - Or your exact URL: `https://your-project.vercel.app/*`

If the API key has no restrictions (default for many new projects), you can skip this step.

## Step 4: Optional – custom domain

In the Vercel project: **Settings** → **Domains** → add a domain you own. Follow the DNS instructions Vercel shows; once DNS propagates, the app will be available at that domain.
