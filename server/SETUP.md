# Class login setup (about 15 minutes, once)

Class sign-in needs three things: a **Google Sheet** (name list + records), a **Google Apps Script** (checks sign-ins, saves progress and records) and a **Google OAuth Client ID** (shows the "Sign in with Google" button).

Until this is done, the game works exactly as before: students type a nickname and progress stays on their device.

> 🔒 Student names and emails stay in **your private Google Sheet**. Never put them in `index.html` or anywhere in this GitHub repo.

---

## Step 1 · The Google Sheet
- You can use the same spreadsheet as the S1 game (the one with the **`使用者 Users`** tab), or make a new one with a tab of that name.
- Columns, from A: **Email · Role · Chinese Name · English Name · Class · Class No.** Staff rows use the role `教職員`.
- Add your S3 students (and yourself) as rows.
- Copy the **Sheet ID** from the address bar: `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
- The game adds two new tabs by itself: **`物理記錄 Physics Records`** and **`物理進度 Physics Progress`**. Your other tabs (including the S1 game's) are not touched.

## Step 2 · The Google Client ID
- `index.html` already uses the S1 game's Web **OAuth Client ID**. That works because both games live on `https://kcchamaa-sys.github.io`.
- To use your own instead: [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials) → **Create credentials → OAuth client ID → Web application**, add `https://kcchamaa-sys.github.io` to **Authorised JavaScript origins**, save, and copy the Client ID (it ends with `.apps.googleusercontent.com`).

## Step 3 · The Apps Script
- Go to [script.google.com](https://script.google.com) → **New project** → name it `Puff's Physics Escape server`.
- Delete the sample code and paste everything from **`server/Code.gs`**.
- **Project Settings (⚙️) → Script properties → Add**:

  | Property | Value |
  |---|---|
  | `SHEET_ID` | the Sheet ID from Step 1 |
  | `CLIENT_ID` | the Client ID from Step 2 (the same one as in `index.html`) |
  | `TEACHER_EMAILS` | *(optional)* e.g. `abc@school.edu.hk, def@school.edu.hk` |
  | `USERS_SHEET` | *(optional)* only if your users tab is not called `使用者 Users` |

> Use a **new** Apps Script project. Don't add this file to the S1 game's script: both have a `doPost`.

## Step 4 · Deploy it
- **Deploy → New deployment → ⚙️ Web app**
  - Execute as: **Me**
  - Who has access: **Anyone**
- Click **Deploy**, allow the permissions, and copy the **Web app URL** (it ends with `/exec`).

## Step 5 · Connect the game
Put the URL into the settings block near the top of the script in `index.html`:

```js
window.S3_CONFIG = { GOOGLE_CLIENT_ID: "…apps.googleusercontent.com", API_URL: "https://script.google.com/macros/s/…/exec", SCHOOL_DOMAIN: "your-school.edu.hk" };
```

- `SCHOOL_DOMAIN`: school accounts on this domain that are **not** on the name list can still play in **guest mode** (progress on that device only, no records). Accounts from other domains are refused. Leave it empty to refuse everyone not on the list.

## Step 6 · Test
- Open the game → **Sign in with Google** with a student test account → escape a room or finish a Light Rush round → check that a row appears in `物理記錄 Physics Records` and `物理進度 Physics Progress`.

---

### Good to know
- **Adding students later:** add rows to `使用者 Users`. Changes apply within 5 minutes.
- **"Access blocked" for students:** your school's Google Workspace may block new apps. Ask IT to mark the Client ID as **Trusted** in Admin console → Security → API controls.
- **Updating Code.gs:** paste the new code, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The /exec URL stays the same.
- **Older copies never win:** a save from an old tab (earlier last day played, fewer days or fewer correct answers) is refused and the newer cloud copy is sent back to the game.
- **The 🏅 leaderboard** is separate (nicknames only, see `leaderboard/SETUP.md`).
