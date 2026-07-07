# AI Meeting Notes

Welcome to **AI Meeting Notes**! This application helps you instantly turn messy meeting transcripts into clean, readable summaries and actionable to-do lists.

If you spend too much time reading over transcripts from Zoom, Teams, or Google Meet, this tool will do the heavy lifting for you in seconds.

### 🚀 Live Demo
**Try the deployed app here:** [Click Here](https://ai-meeting-notes-theta.vercel.app/) 

**To view the demo video:** [Click Here](https://youtu.be/EF0ZkxbET0o)
## Features

- **Instant Summaries:** Paste your meeting transcript and get a concise 2-4 sentence summary of what was discussed.
- **Action Items Extraction:** We automatically identify any tasks, deadlines, or assignments mentioned in the meeting and format them into a clean checklist.
- **Searchable History:** Every meeting you process is saved securely to your personal dashboard, so you can revisit past decisions at any time.
- **Absolute Privacy:** Your data is secured with row-level security. Only you can see your meeting notes, and they are never used to train our AI models.

## How to Use

1. **Sign Up / Log In**: Create a free account using your email address. 
2. **Paste Transcript**: Once logged in, go to your Dashboard and paste any raw meeting transcript (must be at least 20 characters).
3. **Generate**: Click the "Generate Notes" button. In less than 5 seconds, you will receive your summary and action items!

## Important Note on Email Limits (Sign Ups)

> **Note:** We use a secure email provider to send confirmation and login emails. To prevent spam, this system has a strict limit of emails per hour. 
>
> If you try to sign up or request multiple login links rapidly, you might see an **"Email rate limit exceeded"** error. If this happens, simply wait an hour for the limit to reset before trying again.

## Pricing & Upgrades (Testing)

**Starter Plan (Free)**
You get 3 free generations every single day. This is perfect for occasional meetings.

**Pro Plan ($9/mo)**
If you are a power user or a manager with back-to-back meetings, you can upgrade to the Pro plan from the **Account** page. 

💳 **Testing the Checkout Flow:** Since the app is in test mode, you can upgrade for free without using a real credit card! Just use Stripe's magic test card:
- **Card Number:** `4242 4242 4242 4242`
- **Expiration:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)

---

## 💻 Running on Your Local Machine

If you want to download and run the code yourself locally, follow these steps:

1. **Clone or download** this repository.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Copy the example environment file and fill in your keys (Supabase, Groq, and Stripe):
   ```bash
   cp .env.local.example .env.local
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** and navigate to `http://localhost:3000`.

*(If you are testing Stripe webhooks locally, remember to run `stripe listen --forward-to localhost:3000/api/stripe/webhook` in a separate terminal!)*

---

*Thank you for using AI Meeting Notes! Say goodbye to tedious meeting follow-ups.*
