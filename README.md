# Interactive Gradient Descent Visualizer
A high-performance, WebAssembly-powered visualization tool for exploring optimization algorithms in real-time — all in your browser.

## Features
- **WASM + Rust** for fast numerical computation in the browser
- **Plotly.js** for interactive 2D & 3D plots
- **Live gradient descent animation** on click
- Modular optimizer framework (line search, gradient descent)
- Click anywhere to start finding the function minima
- Custom objective functions: quadratic, Himmelblau, Rastrigin...

## Tech Stack
| Layer           | Technology                                                    | Why It Matters                            |
| --------------- | ------------------------------------------------------------- | ----------------------------------------- |
| **Core Engine** | [Rust](https://www.rust-lang.org/)                            | Fast, safe systems programming            |
| **Frontend**    | [React + TS](https://react.dev)                 | Strong typing in the browser              |
| **Graphics**    | [Plotly.js](https://plotly.com/javascript/)                   | High-quality interactive 2D/3D plotting   |
| **WASM Bridge** | [wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/) | Seamless JS ↔ Rust integration            |
| **Bundler**     | [Vite](https://vitejs.dev/)                                   | Ultra-fast development & optimized builds |
| **Deploy**      | GitHub Pages under `owen.gombas.ch`                           | Free & secure static site hosting         |

## Live
[https://owen.gombas.ch](https://owen.gombas.ch)
Click anywhere on the plot — watch gradient descent unfold in real-time.

## Project Structure
```
wasm/                   Rust source code (Function trait, optimizers)
  ├── function.rs
  ├── himmelblau.rs
  ├── optimizer.rs
  └── lib.rs            Exposes WASM interface

src/                    TypeScript frontend
  ├── main.ts           Plotting, animation, interaction
  └── index.html        Basic layout with toggle and canvas

vite.config.ts          WASM/Vite glue
```
