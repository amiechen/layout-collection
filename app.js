const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");
const stitchesCSSPath =
  "https://rawgit.com/amiechen/web-component-library/master/stitches.css";

let stitchesHTML = html => `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href=${stitchesCSSPath}>
    <title>Stitches</title>
  </head>
  <body class="st">${html}</body>
</html>`;

app.use(express.static("."));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/download", (req, res) => {
  let templates = req.body.data; // e.g. [ 'nav-1', 'hero-1' ]
  let file = path.join(__dirname + "/stitches.html");
  let html = "";

  templates.forEach(template => {
    html += fs.readFileSync(
      path.join(__dirname + `/templates/${template}.html`),
      "utf-8"
    );
  });

  fs.writeFile(file, stitchesHTML(html), "utf8", err => {
    if (err) throw err;
    res.download(file);
    res.json({ data: stitchesHTML(html) });
  });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
