# horizon PLUS – Advanced News/Blog Platform

## Features

- File upload (images for posts)
- Full authentication (JWT login/signup/protected routes)
- Rich editor, categories, subcategories
- Admin panel, mobile ready
- Easy deployment

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env # set MONGO_URL and JWT_SECRET
node app.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Frontend: Vercel/Netlify
- Backend: Render/Heroku/AWS

## Extend

- Add more features (analytics, translation, AdSense, etc.)

## License

MIT
