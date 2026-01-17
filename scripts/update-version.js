import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const readmePath = path.join(__dirname, '../README.md');
const versionPath = path.join(__dirname, '../src/version.ts');

let readme = fs.readFileSync(readmePath, 'utf8');

const oldVersion = readme.match(/@caspay\/sdk@([\d.]+)/)?.[1];
const newVersion = packageJson.version;

if (oldVersion === newVersion) {
  console.log(`README already up to date (v${newVersion})`);
  process.exit(0);
}

readme = readme.replace(/@caspay\/sdk@[\d.]+/g, `@caspay/sdk@${newVersion}`);

fs.writeFileSync(readmePath, readme);

let versionFile = fs.readFileSync(versionPath, 'utf8');
versionFile = versionFile.replace(/SDK_VERSION = '[\d.]+'/g, `SDK_VERSION = '${newVersion}'`);
fs.writeFileSync(versionPath, versionFile);

console.log(`Updated from v${oldVersion} → v${newVersion}`);
console.log(` - README.md updated`);
console.log(` - src/version.ts updated`);
