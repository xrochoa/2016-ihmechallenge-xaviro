/* Minimal build script — replaces the original 2016 gulp pipeline while
   preserving the same src/ → dist/ layout. Outputs:
     dist/index.html
     dist/assets/js/main.js
     dist/assets/css/style.css
     dist/assets/res/*
     dist/assets/img/*
*/

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const sass = require('sass');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const WATCH = process.argv.includes('--watch');

/* ---------- helpers ---------- */

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function copyDir(from, to) {
    if (!fs.existsSync(from)) return;
    ensureDir(to);
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        if (entry.name === '.DS_Store') continue;
        const src = path.join(from, entry.name);
        const dst = path.join(to, entry.name);
        if (entry.isDirectory()) copyDir(src, dst);
        else fs.copyFileSync(src, dst);
    }
}

function log(tag, msg) {
    console.log(`[${tag}] ${msg}`);
}

/* ---------- tasks ---------- */

function cleanDist() {
    fs.rmSync(DIST, { recursive: true, force: true });
    ensureDir(DIST);
}

function buildHtml() {
    const src = path.join(SRC, 'index.html');
    const dst = path.join(DIST, 'index.html');
    fs.copyFileSync(src, dst);
    log('html', 'index.html');
}

function buildStatic() {
    copyDir(path.join(SRC, 'assets', 'res'), path.join(DIST, 'assets', 'res'));
    copyDir(path.join(SRC, 'assets', 'img'), path.join(DIST, 'assets', 'img'));
    log('static', 'assets/res + assets/img');
}

function buildCss() {
    const entry = path.join(SRC, 'assets', 'scss', 'style.scss');
    const out = path.join(DIST, 'assets', 'css', 'style.css');
    ensureDir(path.dirname(out));
    const result = sass.compile(entry, {
        style: 'compressed',
        loadPaths: [path.join(__dirname, 'node_modules')],
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api']
    });
    fs.writeFileSync(out, result.css);
    log('css', 'style.css');
}

async function buildJs() {
    const entry = path.join(SRC, 'assets', 'js', 'main.js');
    const out = path.join(DIST, 'assets', 'js', 'main.js');
    const options = {
        entryPoints: [entry],
        bundle: true,
        outfile: out,
        target: ['es2017'],
        format: 'iife',
        sourcemap: !WATCH ? false : 'inline',
        minify: !WATCH,
        logLevel: 'warning'
    };
    if (WATCH) {
        const ctx = await esbuild.context(options);
        await ctx.watch();
        log('js', 'watching...');
        return ctx;
    }
    await esbuild.build(options);
    log('js', 'main.js');
}

/* ---------- run ---------- */

async function run() {
    cleanDist();
    buildHtml();
    buildStatic();
    buildCss();
    await buildJs();

    if (!WATCH) {
        log('done', `built to ${path.relative(__dirname, DIST)}/`);
        return;
    }

    /* ----- watch & serve ----- */
    const chokidar = require('chokidar');
    const browserSync = require('browser-sync').create();

    browserSync.init({
        server: { baseDir: DIST },
        open: false,
        port: 3000,
        notify: false,
        ui: false
    });

    chokidar.watch(path.join(SRC, '**/*.html'), { ignoreInitial: true })
        .on('all', () => { buildHtml(); browserSync.reload(); });

    chokidar.watch([path.join(SRC, 'assets/res/**/*'), path.join(SRC, 'assets/img/**/*')], { ignoreInitial: true })
        .on('all', () => { buildStatic(); browserSync.reload(); });

    chokidar.watch(path.join(SRC, 'assets/scss/**/*.scss'), { ignoreInitial: true })
        .on('all', () => {
            try { buildCss(); browserSync.stream(); }
            catch (e) { console.error('[css] error:', e.message); }
        });

    // esbuild's own watcher handles JS; reload on output change:
    chokidar.watch(path.join(DIST, 'assets/js/main.js'), { ignoreInitial: true })
        .on('all', () => browserSync.reload());

    log('serve', 'http://localhost:3000');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
