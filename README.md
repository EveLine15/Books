# BookTracker

**BookTracker** is a responsive single-page application (SPA) for discovering books and saving them to your "Favorites", built with Vanilla JavaScript and the Vite build tool. The app consumes real-time data from the [Open Library API](https://openlibrary.org/developers/api).

---

## Task

https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view

---

## How to run the app

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.0 or higher) and `npm` installed on your system.

### Installation & Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EveLine15/Books.git

   npm install

   npm run build
   ```

---

## Project Structure

```text
├── src/
│ ├── assets/ # Static assets (SVG icons, graphics)
│ │ ├── books-icon.svg
│ │ └── icons.js
│ │
│ ├── components/ # Reusable UI components
│ │ ├── bookCard.js # Book card component renderer
│ │ ├── burgerMenu.js # Mobile navigation drawer logic
│ │ ├── catalog.js # Isolated book grid container component
│ │ ├── error.js # Error and empty state views
│ │ └── pagination.js # Dynamic pagination control component
│ │
│ ├── pages/ # Main page route views
│ │ ├── catalogPage.js # Catalog search and filter page module
│ │ └── favoritesPage.js # Saved favorite books page module
│ │
│ ├── styles/ # Application stylesheets
│ │ ├── catalog.css # Grid, search inputs, and catalog styles
│ │ ├── favorites.css # Favorites collection styles
│ │ └── main.css # Global styles, CSS variables, theme, & header
│ │
│ ├── utils/ # Helper functions and utilities
│ │ ├── constants.js # Global constants and configuration limits
│ │ ├── debounce.js # Debounce utility for search input events
│ │ ├── router.js # Hash router & URL query parameters parser
│ │ ├── storage.js # LocalStorage wrapper for favorites data
│ │ └── theme.js # Theme switching (light/dark) & initialization
│ │
│ ├── api.js # Open Library API fetch client
│ └── main.js # Application entry point
│
├── .gitignore # Git untracked file rules
├── index.html # Main HTML entry template
├── package.json # NPM dependencies and scripts
├── README.md # Project documentation
└── vite.config.js # Vite configuration file
```
