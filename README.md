# 🧩 Eternity Puzzle Solver — React + Tailwind + Vite

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
- 🎨 Toggle between SVG and Symbol motif styles
- 🧪 Board state auto-loaded from the URL
- ✨ Animated drop effects and hover previews

---

## 🔨 Roadmap

### 🐞 Bugs & Fixes

- [ ] Prevent multiple motifs from rendering simultaneously on some pieces
- [ ] Ensure piece numbers are clearly visible in PiecePalette (increase font size)
- [ ] Fix triangle rendering for both motif types (rotate 90° and stretch to fill)
- [ ] Piece rotation should shift edge mapping — not visually rotate numbers
- [ ] Prevent overpopulation: only load as many pieces as needed for board size

### ✨ UX Improvements

- [ ] Position the PiecePalette at the top of the window by default
- [ ] Move "Show Pieces" button under the "Motif Style" selector
- [ ] Add a "Rotate Board" button (clockwise 90°) and update all rotations
- [ ] Add a "Clear Board" button with confirmation dialog (defaults to Cancel)
- [ ] Add ghost drop preview effect on hovered targets
- [ ] Add subtle animations to piece drop-ins and board transitions
- [ ] Add a maximum size for board pieces
- [ ] Create a better Title

### 🔐 Placement Constraints

- [ ] Prevent corner pieces (2 sides with color 0) from being placed anywhere but corners
- [ ] Prevent edge pieces (1 side with color 0) from being placed anywhere but edges
- [ ] Prevent center pieces (0 sides with color 0) from being placed in corners or edges
- [ ] Auto-rotate corner and edge pieces to align color 0 with the outside border

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
| Motif rendering logic       | 🔧 In Progress  |
| Piece rotation support      | 🔧 In Progress  |
| Clear/Rotate board          | 🔲 Planned      |
| UX enhancements             | 🔲 Planned      |
| Edge/corner logic rules     | 🔲 Planned      |
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

Made with love 💙 by [@nater0000](https://github.com/nater0000)

---

## 📝 License

MIT