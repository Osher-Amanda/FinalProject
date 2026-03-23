Rental Listings App

I built this app while I was going through the process of looking for an apartment myself, and I quickly realized how frustrating it is. Most rental platforms focus on showing listings, but not on actually helping you choose between them. I found myself opening tons of tabs, forgetting details, and trying to compare everything in my head.

As an olah chadasha, it was even harder. I didn’t really know the different areas, what they’re like, or how to decide if a place would actually suit me without physically going there.

This app is different because it focuses on decision-making, not just browsing. It brings everything into one place so you can properly evaluate your options instead of feeling overwhelmed.

You can search and filter listings, compare them side-by-side, save your favorites, read and add reviews to understand areas better, and even get recommendations for similar listings — all without losing track of what you’ve seen.


----------------------

Live App

Frontend (Vercel):
https://final-project-zeta-woad.vercel.app

Backend (Render):
https://finalproject-backend-hqi0.onrender.com

GitHub Repository:
https://github.com/Osher-Amanda/FinalProject


----------------------

Key Features

- Search and filter listings (price, city)
- Save favorites for quick access
- Compare up to 3 listings side-by-side
- Add and view reviews to understand areas better
- Helpful for new residents (olim chadashim) unfamiliar with locations
- Smart recommendations based on similar listings
- In-app notifications (saving favorites, adding reviews)


----------------------

Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL (Neon)

Deployment:
- Vercel (frontend)
- Render (backend)


----------------------

API Endpoints

Listings
- GET /listings
- POST /listings

Favorites
- GET /favorites?user_id=1
- POST /favorites
- DELETE /favorites/:id

Reviews
- GET /reviews/:listing_id
- POST /reviews


----------------------

Run Locally

Clone the repository:
git clone https://github.com/Osher-Amanda/FinalProject.git

Then:
cd FinalProject

Backend:
cd backend
npm install
node server.js

Frontend:
cd frontend
npm install
npm run dev


----------------------

Environment Variables

Create a .env file in the backend folder and add:

DATABASE_URL=your_neon_database_url


----------------------

Notes

- Database is hosted on Neon (cloud PostgreSQL)
- Frontend communicates with backend via REST API


----------------------

Author

Osher Amanda Favel