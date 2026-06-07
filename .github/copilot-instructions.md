# Pottery Glaze Manager - Setup Instructions

## Project Overview
A React-based web application for tracking pottery glaze inventory and recipes with automatic batch scaling and inventory management.

## Features
- ✨ Inventory management (add, edit, delete chemicals)
- 📝 Recipe management (save glaze formulas with ingredients)
- ⚖️ Batch scaling (calculate quantities and check availability)
- 💾 Local storage (all data saved in browser)
- 🎨 Modern, simple UI

## Next Steps

### 1. Install Node.js
You need Node.js to run this project. Download from https://nodejs.org/
- **Recommended**: LTS version (Latest Stable)
- Download and install the Windows installer
- Restart your terminal/VS Code after installation

### 2. Install Dependencies
After Node.js is installed, open a terminal in VS Code and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The app will automatically open in your browser at http://localhost:5173

### 4. Start Using the App
- **Inventory Tab**: Add and manage your chemicals
- **Recipes Tab**: Create glaze recipes with ingredients
- **Make Glaze Tab**: Scale recipes and produce batches

## Project Structure
```
Receptenboek/
├── src/
│   ├── components/
│   │   ├── Inventory.jsx (Chemical inventory management)
│   │   ├── Recipes.jsx (Recipe creation and storage)
│   │   └── RecipeScaler.jsx (Batch scaling and production)
│   ├── App.jsx (Main app component)
│   ├── main.jsx (App entry point)
│   └── index.css (Global styles)
├── index.html (HTML entry point)
├── vite.config.js (Build configuration)
├── package.json (Dependencies)
└── README.md (User guide)
```

## Troubleshooting

**Port already in use?**
- The default port is 5173. If it's in use, Vite will try the next available port.

**Changes not showing?**
- The dev server has hot reload. Just save your file and the browser will update automatically.

**Need to clear data?**
- Open browser DevTools (F12) → Application/Storage → LocalStorage → Delete the entries

## Build for Production
```bash
npm run build
npm run preview
```

This creates an optimized version in the `dist/` folder.
