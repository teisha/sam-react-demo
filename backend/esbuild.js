const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild')

const functionsDir = 'sam-disco-lambdas/lambdas';
const outDir = 'dist';
const entryPoints = fs.readdirSync(path.join(__dirname, functionsDir)).map((entry) => `${functionsDir}/${entry}/index.ts`);

esbuild.build({
    entryPoints,
    bundle: true,
    outdir: path.join(__dirname, outDir),
    outbase: functionsDir,
    platform: 'node',
    sourcemap: 'inline'

})

