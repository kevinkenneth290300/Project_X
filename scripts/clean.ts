import { rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(scriptPath), '..');

export function cleanBuildArtifacts(root: string = projectRoot): void {
  for (const artifact of ['dist', 'server.js']) {
    rmSync(resolve(root, artifact), { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  cleanBuildArtifacts();
}