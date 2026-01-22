<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ok-8WK-at-hodw7cxRrDltTZEWZaw0Bk

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`

2. (Optional) If you use Gemini features, set `GEMINI_API_KEY` in [.env.local](.env.local)

3. Configure email sending (required for order emails)
   - Copy `.env.server.local.example` to `.env.server.local`
   - Fill in:
     - `RESEND_API_KEY`
     - `OWNER_EMAIL`
     - `FROM_EMAIL`

4. Run frontend + backend together:
   `npm run dev:all`

   - Frontend: http://localhost:5173
   - Backend API (health): http://localhost:8787/health

### Deploy notes

You need to deploy the **frontend** and **backend**:
- Frontend: any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
- Backend: any Node hosting (Render, Railway, Fly.io, etc.)

On the frontend host, set `VITE_API_URL` to your backend URL (example: `https://your-backend.onrender.com`).
