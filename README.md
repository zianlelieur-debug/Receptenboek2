# 🎨 Pottery Glaze Manager

A simple web application to manage your pottery glaze inventory and recipes. Track your chemical stock, save glaze recipes, and calculate quantities needed for different batch sizes.

## Features

✨ **Inventory Management**
- Add chemicals with quantities and units
- Update quantities as you use materials
- Delete items you no longer have

📝 **Recipe Management**
- Save glaze recipes with ingredients and quantities
- Specify base quantities (e.g., "1 liter of glaze")
- Store recipes locally in your browser

⚖️ **Recipe Scaling**
- Select a recipe and adjust the quantity
- Automatically calculates ingredient amounts
- Shows if you have enough materials
- Subtracts used materials from inventory when you make the glaze

💾 **Local Storage**
- All data is saved in your browser
- No account needed
- Your recipes and inventory persist between sessions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project folder:
   ```bash
   cd Receptenboek
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will open in your browser at `http://localhost:5173`

### Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How to Use

### 1. Add Your Chemicals (Inventory Tab)
- Click the Inventory tab
- Enter chemical name, quantity, and unit
- Click "Add Chemical"
- Edit quantities by clicking in the quantity field
- Delete items with the Delete button

### 2. Create Recipes (Recipes Tab)
- Click the Recipes tab
- Enter recipe name and base quantity (e.g., "1 liter")
- Add ingredients one by one (name and quantity in grams)
- Click "Save Recipe"
- View saved recipes on the left side

### 3. Make a Glaze (Make Glaze Tab)
- Click the Make Glaze tab
- Select a recipe
- Adjust the desired quantity
- See what ingredients you need and if you have enough
- If you have all ingredients, click "Make This Glaze"
- Your inventory will be automatically updated

## Tips

- Use grams for measuring dry ingredients
- Use milliliters/liters for liquids
- Double-check your ingredient names match between recipes and inventory
- Your data is stored locally - clearing browser data will delete everything

## Browser Compatibility

Works in any modern browser that supports:
- React 18
- ES6+
- LocalStorage API

## Remote Sync and Deployment

This project now supports cloud sync with Firebase Firestore. When configured, your inventory and recipes will be saved remotely so you can open the app on another device and see the same data.

### Setup Firebase

1. Create a free Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database in test mode
3. Create a `.env` file in the project root
4. Copy the values from `firebaseConfig` in the Firebase project settings
5. Paste them into the `.env` file like this:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### GitHub Pages deployment

This repository includes a GitHub Actions workflow that builds the app and deploys it to GitHub Pages on every push to `main`.

> Note: The workflow file must live in `.github/workflows/pages.yml`. If you see an extra `pages.yml` file at the repository root, remove that duplicate file from GitHub so only the workflow file remains.

#### Eenvoudige publicatie via GitHub Pages
1. Maak een GitHub-repository aan en push deze code naar de `main` branch.
2. Zorg dat de bestanden in `.github/workflows/pages.yml` aanwezig zijn.
3. Ga naar de repository-instellingen op GitHub en bekijk de GitHub Pages URL.
4. De app zal na de actie beschikbaar zijn via iets als `https://<gebruikersnaam>.github.io/<repo-naam>/`.
5. Stuur deze link naar je moeder. Zij kan de app openen in Chrome of Safari zonder dat jouw computer aan staat.

> Als je geen Firebase gebruikt, werkt de app wel als website, maar wordt de data niet gedeeld tussen apparaten. Als je dezelfde gegevens wilt gebruiken op meerdere apparaten, configureer dan Firebase en voeg de `VITE_...` secrets toe.

To publish with Firebase sync enabled, add these repository secrets in GitHub:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The deploy workflow will generate a `.env` file during the build step so the live site can connect to your Firebase project.

### Run locally with sync

```bash
npm install
npm run dev
```

### Deploy to a free hosting service

You can publish this app as a link from services like Vercel or Netlify.

- Push your code to GitHub
- Connect the repository to Vercel or Netlify
- Add the same `VITE_...` Firebase environment variables in the hosting dashboard
- Deploy the site

This repo also includes a GitHub Actions workflow for GitHub Pages deployment. When you push to `main`, it will build the app and publish the site to the `gh-pages` branch.

When the app is live, open it on any device and your data will stay in sync.

## Open the App on a Computer or iPad

If you want your mother to use the app without installing anything, publish it and open it in a browser.

Option 1: Use GitHub Pages
1. Push this repository to GitHub on the `main` branch.
2. In the repository settings, enable GitHub Pages using the `gh-pages` branch.
3. Add Firebase environment secrets if you want the data to sync across devices.
4. Wait for the workflow to finish and then open the published link in a browser.

Option 2: Run locally on one computer and open from the same network
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app for network access:
   ```bash
   npm run dev -- --host
   ```
3. Note the local network address shown in the terminal, for example:
   `http://192.168.1.10:5173`
4. Open that address in Safari on the iPad or on another computer connected to the same Wi-Fi network.

Option 3: Use a hosted service like Vercel or Netlify
1. Push the repository to GitHub.
2. Connect the repository in Vercel or Netlify.
3. Add the same `VITE_...` Firebase environment variables in the hosting dashboard.
4. Deploy the site and open the public URL in any browser.

## Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)

## License

This project is open source and available for personal use.

---

Happy glazing! 🎨
Trigger firebase deploy
trigger firebase deploy