# Firebase setup (step-by-step)

Follow these steps in order. You’ll need a Google account.

---

## Step 1: Create a Firebase project

1. Open: **https://console.firebase.google.com**
2. Sign in with your Google account.
3. Click **“Create a project”** (or **“Add project”**).
4. **Project name:** e.g. `trivia-app` (or anything you like). Click **Continue**.
5. **Google Analytics:** You can turn **OFF** “Enable Google Analytics” for this demo (or leave it on). Click **Create project**.
6. Wait for “Your new project is ready”, then click **Continue**.

You should now see the Firebase project overview (Project Overview page).

---

## Step 2: Create a Firestore database

1. In the **left sidebar**, click **“Build”** → **“Firestore Database”**.
2. Click **“Create database”**.
3. **Security rules:** Choose **“Start in test mode”** (we’re only testing; you can lock it down later). Click **Next**.
4. **Location:** Pick a region close to you (e.g. `us-central1` or `europe-west1`). Click **Enable**.
5. Wait until the database is created. You’ll see an empty “Firestore Database” screen with “Start collection” or an empty list. You don’t need to create any collections by hand—the app will create the `games` collection when you click **Start Lobby** in the admin.

Firestore is ready.

---

## Step 3: Register the web app and get config

1. In the **left sidebar**, click the **gear icon** next to “Project Overview” → **“Project settings”**.
2. Scroll down to **“Your apps”**.
3. Click the **Web** icon: **`</>`** (it says “Web” under it).
4. **App nickname:** e.g. `Trivia web`. Click **Register app**.
5. On “Add Firebase SDK”, you’ll see a code snippet with something like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc..."
   };
   ```
   **Don’t copy the code.** Just note the **values** (or keep this tab open).
6. Click **Next**, then **Continue to console**.

You now have everything needed for `.env.local`.

---

## Step 4: Put the config into your app

1. Open your project in Cursor and open the file **`.env.local`** (in the root of “Trivia APP”).
2. Replace the empty values with the ones from the Firebase config. It should look like this (with *your* values):

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
   ```

   - No quotes around the values.
   - No spaces around the `=` sign.
   - Get each value from the matching key in the Firebase snippet (e.g. `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`).

3. **Save** the file.

Your dev server (if it’s running) will reload and use the new config.

---

## Step 5: Run the trivia app

1. In the browser go to: **http://localhost:3000/admin**
2. Click **“Start Lobby”** once. This creates the game in Firestore.
3. Open **http://localhost:3000/join** in another tab (or on your phone on the same WiFi). Enter a name and join—you should see “Waiting for host…”.
4. Back on **/admin**, click **“Start Question”**. On the join tab you should see the first question. Answer it, then on admin click **“Reveal Results”** to see scoring and the leaderboard.

You’re done. For a real all-hands, share the join URL (**http://localhost:3000/join** or your network URL) so others can join from their phones.
