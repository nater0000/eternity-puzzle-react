# 🧩 Eternity II Puzzle Playground

Welcome to the interactive **Eternity II puzzle solver**, built with **React**, **TypeScript**, **Vite**, and styled using **TailwindCSS**.  
This project transforms the original static puzzle viewer into a dynamic, client-side drag-and-drop playground 🎯.

#
<sub>[![Using GitHub Pages](https://github.com/nater0000/eternity-puzzle-react/actions/workflows/deploy.yml/badge.svg)](https://github.com/nater0000/eternity-puzzle-react/actions/workflows/deploy.yml)</sub>
<br><sub>🚀 **Deployed to:** https://e2.rickey.io</sub>

---

## 🔧 Tech Stack

- 🧬 React 18  
- ⚡ Vite  
- 🎨 TailwindCSS  
- ✨ TypeScript  
- 🔁 Hot Module Reloading  
- ☁️ GitHub Actions CI/CD

---

## 🧠 Features & Behavior

- 🧩 Drag-and-drop support for placing and rearranging pieces
- 🔁 Smooth internal swapping logic for placed pieces
- 🎮 Cancel or revert dropped pieces if released off-board
- 📦 Pop-up Piece Palette with rotation + drag handling
- 🧭 Rotation-aware motif rendering and edge positioning
- 🧮 Responsive board scaling to fit view
- 🎨 Toggle between Original and Custom motif styles
- 🧪 Board state auto-loaded from the URL
- ✨ Animated drop effects and hover previews

---

## 🔨 Roadmap

### 🐞 Bugs & Fixes

- [x] Ensure piece numbers are clearly visible in PiecePalette (increase font size)
- [x] Piece rotation should shift edge mapping — not visually rotate numbers
- [x] Fix svg motif consistency
- [x] Fix Rotations when swapping edges/corners
- [x] Fix symbol motifs
- [x] Fix Piece Palette changing height when window is resized horizontally
- [x] Fix piece drag highlight being hidden by placed piece
- [x] Fix piece drag size to be smaller than board pieces
- [x] Fix piece dropping not always properly detected
- [ ] Support motifs_order parameter on url load
- [ ] Fix visual glitches on piece drag highlighting

### ✨ UX Improvements

- [x] Position the Piece Palette at the top of the window by default
- [x] Move "Show Pieces" button under the "Motif Style" selector
- [x] Add a "Rotate Board" button (clockwise 90°) and update all rotations
- [x] Add a "Clear Board" button with confirmation dialog (defaults to Cancel)
- [x] Add a maximum size for board pieces
- [x] Create a better Title
- [x] Convert 'Constraint' alerts into notification banners
- [x] Make the Control Panel text/buttons vertically smaller
- [x] Add a hamburger button in the upper left of the Control Panel to hide/show the Control Panel
- [x] Add an Image that links to the github repo into the Control Panel
- [x] Make Piece Palette start taller and below the Control Panel
- [x] Make 'Show Pieces' and 'Hide Pieces' button the same width
- [x] Rename 'Show/Hide Pieces' to 'Show/Hide Palette' or something better
- [x] Custom drag and drop rendering
- [x] Auto-rotate corner/edge pieces on drag
- [x] Add ghost drop preview effect on hovered targets
- [ ] Support Mobile form factor: zoom, move, scroll palette, drag pieces
- [ ] Add Conflict Scoring
- [ ] Add Type overlay
- [ ] Add Score display
- [ ] Add support to load known puzzles
- [ ] Allow Piece Palette to be embedded instead of floating
- [ ] Add display toggles for 'Piece Number'
- [ ] Add display toggles for 'Type'
- [ ] Add display toggles for 'Score'
- [ ] Add display toggles for 'Conflicts'
- [ ] Add subtle animations to piece drop-ins and board transitions

### ⚡ Future Features

- [ ] Generate and Copy Puzzle URL
- [ ] Support custom piece lists
- [ ] Support png based motifs

### 🔐 Placement Constraints

- [x] Prevent corner pieces (2 sides with color 0) from being placed anywhere but corners
- [x] Prevent edge pieces (1 side with color 0) from being placed anywhere but edges
- [x] Prevent center pieces (0 sides with color 0) from being placed in corners or edges
- [x] Auto-rotate corner and edge pieces to align color 0 with the outside border

---

## 🧱 Development Status

| Component/Feature            | Status         |
|-----------------------------|----------------|
| App layout & CSS foundation | ✅ Complete     |
| PuzzleBoard grid & pieces   | ✅ Complete     |
| Drag and drop logic         | ✅ Complete     |
| PiecePalette with overlay   | ✅ Complete     |
| URL-based puzzle loader     | ✅ Complete     |
| Viewport responsiveness     | ✅ Complete     |
| Piece rotation support      | ✅ Complete     |
| Clear/Rotate board          | ✅ Complete     |
| Edge/corner logic rules     | ✅ Complete     |
| Motif rendering logic       | ✅ Complete     |
| UX enhancements             | 🔧 In Progress  |
| Export/import board state   | 🔲 Planned      |

---

## 🚀 Getting Started

Run the following commands:

```
npm install
npm run dev
```

Then open your browser to:

```
http://localhost:5173
```

---

## 👨‍💻 Author

Made with love 🧩💙🤖 by [@nater0000](https://github.com/nater0000)

---

## 📝 License

MIT
