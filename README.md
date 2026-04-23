# Overweight and Obesity — IHME Coding Challenge (2016)

Interactive world map visualization of global overweight and obesity
prevalence (BMI ≥ 25), built in **2016** as a coding challenge for the
[Institute for Health Metrics and Evaluation (IHME)](http://www.healthdata.org/).

Switch between a **bubble map** and a **choropleth map** using the
Winkel-III projection, click or select any country to zoom in, and filter
the dataset by sex. Each selection animates the SVG map and a small per-
country bar graph with mean and uncertainty interval.

## Features

- D3-powered SVG world map with Winkel-III projection
- Two visualization modes: bubble and choropleth
- Country drill-down with animated zoom and info box
- Per-country bar graph showing mean + uncertainty interval
- Sex-based data filtering (male / female / both)
- Responsive layout for desktop, tablet, and mobile
- Event-driven architecture using `d3-dispatch`

## Technologies

- **D3 v4** (selection, geo, geo-projection, scale, transition, array,
  dispatch, collection)
- **topojson-client** for TopoJSON → GeoJSON conversion
- **SCSS** with a modular structure (`_colors`, `_fonts`, `_main`, `_map`,
  `_responsive`)
- **ES2015 modules** for application code
- **esbuild** + **dart-sass** as the build pipeline
- **Browsersync** for local development

> The original 2016 build used a Gulp 3 + Browserify + Babel 6 pipeline.
> That stack no longer installs on modern Node.js, so the build tooling
> has been replaced with a small `build.js` script that preserves the
> original `src/` → `dist/` layout and behaviour. The application source
> (SCSS, ES2015 modules, HTML) is unchanged in spirit and structure.

## What this project demonstrates

Written at an early–mid web-development stage of the author's career, this
project shows:

- Comfort with data-driven visualization (D3 v4's modular API, projections,
  scales, transitions)
- A clean event-bus architecture using `d3-dispatch` to decouple the map,
  select boxes, and data layer
- Solid build-tooling fundamentals for 2016 (modular SCSS, ES2015 modules,
  bundling, linting, minification, source maps)
- An eye for UI polish within the constraints of the time period

## Project year

**2016**

## Run locally

Requires Node.js 18+ (tested on Node 20/24).

```bash
npm install
npm run dev      # dev server with live reload → http://localhost:3001
npm run build    # production build → ./dist
```

The dataset (originally served from a Firebase endpoint) is now bundled as
static JSON under `src/assets/res/data/` and copied into `dist/` at build
time, so the app runs fully offline.

## Deploy to Netlify

This repository ships with a `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

To deploy:

1. Push the repository to GitHub / GitLab / Bitbucket.
2. On Netlify, **Add new site → Import an existing project** and pick the
   repo. Netlify will auto-detect the build command and publish directory.
3. Or, from a local shell: `npx netlify deploy --build --prod`.

No environment variables or additional configuration are required.

---

*Coding challenge — Xavier Reyes Ochoa, 2016.*
