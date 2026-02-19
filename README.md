<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1p6ymFu9Vr7ctmCpPpKgdZzPL9oML9Nqr

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Public Access (ngrok)

To share your app with your team, use this public URL (ngrok):

```
https://valda-toxicological-perspiringly.ngrok-free.dev
```
```
npx ngrok http 3000
```
```
npm run dev
```
```
cd server/node index.ts
```
```
qrcode-terminal https://valda-toxicological-perspiringly.ngrok-free.dev
qrcode-terminal https://sour-needles-wash.loca.lt
npx localtunnel --port 3000
```
```
node scripts/generate-qr.cjs 'https://valda-toxicological-perspiringly.ngrok-free.dev'
```
Make sure your Vite dev server and ngrok tunnel are both running.


