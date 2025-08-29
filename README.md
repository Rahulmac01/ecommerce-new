# MyShop — Beginner E‑Commerce Demo (Front‑End Only)

This is a **beginner-friendly** static website project: Login page, Registration page, Navigation bar, and **6 demo products** with a simple cart — all running on **HTML, CSS, JS** and **localStorage** (no backend).

> ⚠️ Security note: This is for learning only. Do **not** store real passwords or personal data. Everything is saved in the browser (localStorage).

## Files
- `index.html` — Home + products + cart
- `login.html` — Login page (localStorage-based)
- `register.html` — Registration page (localStorage-based)
- `style.css` — Styling
- `script.js` — Form validation, auth, cart

## How to run locally
Just open `index.html` in your browser (double click).

## Deploy to GitHub Pages (quick)
1. Create a new **public** repo on GitHub (e.g., `myshop-demo`).
2. Upload these files (or push via Git).  
3. Go to **Settings → Pages → Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/root`
4. Wait for the green check; your site will be live at:  
   `https://<username>.github.io/<reponame>/`

## Optional: Push via command line
```bash
git init
git add .
git commit -m "Initial commit: MyShop beginner demo"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
