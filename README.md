## BMAD BMM Workshop

# Quick Start

Open a terminal (In IDE?)
Check codex cli is working:
codex exec "Tell me a dad joke"
Clone the workshop repo:
git clone git@github.com:dickymoore/bmad-6-workshop.git
Enter the cloned directory
cd bmad-6-workshop
Install BMAD 6 Alpha:
npx bmad-method@alpha install
y to proceed
Accept defaults, though you can give it your name
Press space to select Codex and Enter to continue
<img width="1085" height="578" alt="image" src="https://github.com/user-attachments/assets/8a0a9fd5-4d83-4cc6-8540-ba064398ec80" />

Git checkout stage-1
Open README.md
Follow the steps
<img width="729" height="304" alt="image" src="https://github.com/user-attachments/assets/5eb80b2e-61f6-4ee4-9745-2f2397903d9a" />









# Office Floorplans Assets

The project files now live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render code and demo: `office-floorplans/src/` + `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

To run the demo:
```bash
cd office-floorplans
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```
