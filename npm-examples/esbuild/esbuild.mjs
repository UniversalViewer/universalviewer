import { build } from 'esbuild';
import { writeFileSync } from "fs";
import * as path from 'path';
import serve, { error, log } from 'create-serve';

const watch = process.argv.includes('--watch') || process.argv.includes('-w');

async function main() {
    writeFileSync(
        path.join(process.cwd(), "./dist/index.html"),
        `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>UV Frontend</title>
    <link rel="stylesheet" href="./bundle.css" />
  </head>
  <body>
    <div class="uv" id="root"></div>
    <script src="./bundle.js" type="application/javascript"></script>
  </body>
</html>    
    `
    );

    build({
        entryPoints: ["src/index.ts"],
        outfile: "dist/bundle.js",
        bundle: true,
        minify: true,
        watch: watch && {
            onRebuild(err) {
                serve.update();
                err ? error('× Failed') : log('✓ Updated');
            }
        },
        sourcemap: true,
        target: ["chrome58"],
    });

    serve.start({
        port: 3001,
        root: 'dist'
    });
}

main()