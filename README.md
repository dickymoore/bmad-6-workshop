# BMAD BMM Workshop

Kick off the workshop quickly with the steps below. All commands are run from a terminal (inside your IDE is fine).

## Quick Start
1) **Verify Codex CLI**
   ```bash
   codex exec "Tell me a dad joke"
   ```
2) **Clone this repo**
   ```bash
   git clone git@github.com:dickymoore/bmad-6-workshop.git
   cd bmad-6-workshop
   ```
3) **Install BMAD 6 Alpha**
   ```bash
   npx bmad-method@alpha install
   ```
   - Type `y` to proceed.
   - Accept defaults (add your name if you like).
   - Press **Space** to select *Codex* when prompted, then hit **Enter**.
   <img width="1085" height="578" alt="BMAD install UI" src="https://github.com/user-attachments/assets/8a0a9fd5-4d83-4cc6-8540-ba064398ec80" />
4) **Checkout the workshop stage**
   ```bash
   git checkout stage-1
   ```
5) **Start hacking**
   - Open `README.md`.
   - Follow the exercises for the current stage.

## Office Floorplans Assets
The project files for the floorplans exercise live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render code and demo: `office-floorplans/src/` and `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

Run the demo locally:
```bash
cd office-floorplans
npm install
npm run dev
# then open http://localhost:3000/demo-floorplans
```
