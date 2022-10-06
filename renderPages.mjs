// 1. Find all tsx inside build/pages and create corresponding js files in build (if using parcel set shouldHoise:false)

// For each js file
// 2. import Comp from js files and produce html string using renderToString
// 3. Create [JSName].html with html prefilled and hydrate.[JSName].js that hydrates html with Comp

// 4. run parcel build build/pages/**.*.html
// 5. delete build folder
// 6. serve dist

import { Parcel } from "@parcel/core";
import React from "react";
import { renderToString } from "react-dom/server";
import path from "path";
import fs from "fs";
import handler from "serve-handler";
import http from "http";

new Parcel({
  entries: ["src/pages/**/*.tsx"],
  defaultConfig: "@parcel/config-default",
  targets: {
    main: {
      // scopeHoist: false,
      optimize: true,
      outputFormat: "esmodule",
      distDir: "build",
      isLibrary: true,
      // includeNodeModules: {
      //   react: false,
      // },
    },
  },
})
  .run()
  .then(async ({ bundleGraph, buildTime }) => {
    for (const bundle of bundleGraph.getBundles()) {
      const Comp = await import(bundle.filePath);

      // 2. Get Comp name
      const { dir, name } = path.parse(bundle.filePath);

      // 3. Create hydrate.{PageComponent}.js
      const jsHydrateString = `import ${name} from "./${name}.js";
import { createElement } from "react";
import {hydrate} from 'react-dom'

hydrate(createElement(${name}), document.getElementById("root"));
`;
      fs.writeFileSync(path.join(dir, `hydrate.${name}.js`), jsHydrateString);

      // 4. Create html equivalent with server rendered html
      const serverRenderedHtml = renderToString(
        React.createElement(Comp.default.default)
      );

      const htmlTemplateString = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script type="module" src="hydrate.${name}.js"></script>
</head>

<body>
  <div id="root">${serverRenderedHtml}</div>
</body>

</html>`;

      fs.writeFileSync(
        path.join(dir, `${name.toLowerCase()}.html`),
        htmlTemplateString
      );
    }

    await new Parcel({
      entries: ["build/**/*.html"],
      defaultConfig: "@parcel/config-default",
      mode: "production",
      targets: {
        main: {
          optimize: true,
          outputFormat: "global",
          distDir: "dist",
        },
      },
    }).run();

    // fs.rmSync("build", { recursive: true, force: true });

    const server = http.createServer((request, response) => {
      // You pass two more arguments for config and middleware
      // More details here: https://github.com/vercel/serve-handler#options
      return handler(request, response, {
        public: "dist",
        cleanUrls: true,
        source: "/",
        destination: "/home",
      });
    });

    server.listen(3000, () => {
      console.log("Running at http://localhost:3000");
    });
  })
  .catch((e) => {
    console.log(e);
  });
