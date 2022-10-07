// 1. Find all tsx inside build/pages and create corresponding js files in build (if using parcel set shouldHoise:false)

// For each js file
// 2. import Comp from js files and produce html string using renderToString
// 3. Create [JSName].html with html prefilled and hydrate.[JSName].js that hydrates html with Comp

// 4. run parcel build build/pages/**.*.html
// 5. delete build folder
// 6. serve dist

import { Parcel } from "@parcel/core";
import renderToString from "preact-render-to-string";
import { h } from "preact";
import path from "path";
import fs from "fs";
import handler from "serve-handler";
import http from "http";
import esbuild from "esbuild";

esbuild
  .build({
    bundle: true,
    entryPoints: ["./src/pages/Home.tsx"],
    outdir: "build",
    outExtension: { ".js": ".mjs" },
    format: "esm",
    jsxImportSource: "preact",
    jsx: "automatic",
  })
  .then(async (res) => {
    const Comp = await import("./build/Home.mjs");
    // 3. Create hydrate.{PageComponent}.js
    // const jsHydrateString = `import Home from "./Home.mjs";
    // import { createElement } from "react";
    // import {hydrate} from 'react-dom'
    // hydrate(createElement(Home), document.getElementById("root"));
    // `;
    // fs.writeFileSync(path.join("build", `hydrate.Home.mjs`), jsHydrateString);
    // // 4. Create html equivalent with server rendered html
    const serverRenderedHtml = renderToString(h(Comp.default));
    // const htmlTemplateString = `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Document</title>
    //   <script type="module" src="hydrate.Home.mjs"></script>
    // </head>
    // <body>
    //   <div id="root">${serverRenderedHtml}</div>
    // </body>
    // </html>`;
    // fs.writeFileSync(
    //   path.join("build", `${"Home".toLowerCase()}.html`),
    //   htmlTemplateString
    // );
    // await new Parcel({
    //   entries: ["build/**/*.html"],
    //   defaultConfig: "@parcel/config-default",
    //   mode: "production",
    //   targets: {
    //     main: {
    //       optimize: true,
    //       outputFormat: "global",
    //       distDir: "dist",
    //     },
    //   },
    // }).run();
    // // fs.rmSync("build", { recursive: true, force: true });
    // const server = http.createServer((request, response) => {
    //   // You pass two more arguments for config and middleware
    //   // More details here: https://github.com/vercel/serve-handler#options
    //   return handler(request, response, {
    //     public: "dist",
    //     cleanUrls: true,
    //     source: "/",
    //     destination: "/home",
    //   });
    // });
    // server.listen(3000, () => {
    //   console.log("Running at http://localhost:3000");
    // });
  });
