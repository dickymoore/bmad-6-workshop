import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const officesPath = path.join(projectRoot, 'office-floorplans', 'assets', 'floorplans', 'offices.json');
const publicAssetsDir = path.join(projectRoot, 'public', 'assets', 'floorplans');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function fileExists(p) {
  return fs.existsSync(p) && fs.statSync(p).isFile();
}

function findSourcePng(officeCode, floorId) {
  const candidates = [
    path.join(projectRoot, 'office-floorplans', `demo-${officeCode}-${floorId}.png`),
    path.join(projectRoot, 'office-floorplans', 'assets', 'floorplans', `${officeCode}-${floorId}.png`),
    path.join(projectRoot, 'office-floorplans', 'assets', 'floorplans', `${officeCode.toLowerCase()}-${floorId}.png`),
  ];
  return candidates.find(fileExists);
}

function main() {
  const missing = [];

  if (!fileExists(officesPath)) {
    console.error(`[sync-floorplans] offices.json not found at ${officesPath}`);
    process.exit(1);
  }

  const offices = JSON.parse(fs.readFileSync(officesPath, 'utf-8')).offices ?? [];

  ensureDir(publicAssetsDir);

  offices.forEach((office) => {
    const officeCode = String(office.code ?? '').toUpperCase();
    const officeId = String(office.id ?? '');
    (office.floors ?? []).forEach((floor) => {
      const floorId = String(floor.id ?? '');
      const src = findSourcePng(officeCode, floorId);
      const dest = path.join(publicAssetsDir, `${officeId}-${floorId}.png`);

      if (!src) {
        missing.push({ office: officeId, floor: floorId });
        return;
      }

      fs.copyFileSync(src, dest);
      console.info(`[sync-floorplans] copied ${path.basename(src)} -> ${path.relative(projectRoot, dest)}`);
    });
  });

  if (missing.length) {
    console.error('[sync-floorplans] Missing PNGs for the following office/floor pairs:');
    missing.forEach(({ office, floor }) => console.error(` - ${office}/${floor}`));
    process.exit(1);
  }
}

main();
