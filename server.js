const express = require("express");
const util = require("util");
const fs = require("fs");
const app = express();
const PORT = 8080;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

