import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, type Plugin } from 'vite';

interface BuildModule {
  id: string;
  importers: readonly string[];
  importedIds: readonly string[];
  isEntry: boolean;
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = process.argv[2]
  ? resolve(process.argv[2])
  : join(tmpdir(), `project-x-module-report-${randomUUID()}.json`);
const modules: BuildModule[] = [];

const moduleReport: Plugin = {
  name: 'build-module-report',
  generateBundle() {
    for (const moduleId of this.getModuleIds()) {
      const moduleInfo = this.getModuleInfo(moduleId);
      if (!moduleInfo) throw new Error('Missing build module information');
      modules.push({
        id: moduleId,
        importers: moduleInfo.importers,
        importedIds: moduleInfo.importedIds,
        isEntry: moduleInfo.isEntry,
      });
    }
  },
};

await build({ root: projectRoot, build: { write: false }, plugins: [moduleReport] });
modules.sort((first, second) => first.id.localeCompare(second.id));
writeFileSync(reportPath, JSON.stringify({ moduleCount: modules.length, modules }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ moduleCount: modules.length, reportPath }));