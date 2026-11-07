import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { cleanBuildArtifacts } from '../../scripts/clean.ts';

it('cleans only known generated artifacts and is safe to repeat outside the project cwd', () => {
  const root = mkdtempSync(join(tmpdir(), 'project-x-clean-'));
  try {
    mkdirSync(join(root, 'dist'));
    writeFileSync(join(root, 'dist', 'generated.js'), 'generated');
    writeFileSync(join(root, 'server.js'), 'generated');
    writeFileSync(join(root, 'source.ts'), 'source');
    mkdirSync(join(root, 'data'));
    writeFileSync(join(root, 'data', 'preserved.json'), '{}');
    cleanBuildArtifacts(root);
    cleanBuildArtifacts(root);
    expect(existsSync(join(root, 'dist'))).toBe(false);
    expect(existsSync(join(root, 'server.js'))).toBe(false);
    expect(existsSync(join(root, 'source.ts'))).toBe(true);
    expect(existsSync(join(root, 'data', 'preserved.json'))).toBe(true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it('runs the cleanup CLI from another directory without deleting its artifacts', () => {
  const root = mkdtempSync(join(tmpdir(), 'project-x-clean-cli-'));
  const scriptDirectory = join(root, 'scripts');
  const workingDirectory = join(root, 'unrelated');
  try {
    mkdirSync(scriptDirectory);
    mkdirSync(join(root, 'dist'));
    mkdirSync(workingDirectory);
    mkdirSync(join(workingDirectory, 'dist'));
    writeFileSync(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
    writeFileSync(join(root, 'server.js'), 'generated');
    writeFileSync(join(workingDirectory, 'server.js'), 'preserved');
    writeFileSync(join(workingDirectory, 'dist', 'preserved.txt'), 'preserved');
    const scriptPath = join(scriptDirectory, 'clean.ts');
    copyFileSync(join(process.cwd(), 'scripts', 'clean.ts'), scriptPath);

    execFileSync(process.execPath, [scriptPath], { cwd: workingDirectory });

    expect(existsSync(join(root, 'dist'))).toBe(false);
    expect(existsSync(join(root, 'server.js'))).toBe(false);
    expect(existsSync(join(workingDirectory, 'server.js'))).toBe(true);
    expect(existsSync(join(workingDirectory, 'dist', 'preserved.txt'))).toBe(true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});