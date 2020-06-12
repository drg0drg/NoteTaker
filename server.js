const express = require("express");
const util = require("util");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//------------------------------------------
//---------Routes to static HTML------------
//------------------------------------------
app.use(express.static(__dirname + "/public"))

app.get("/notes", function(req, res){
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "public", "index.html"))
});

app.get("/api/notes", function(req, res){
  const dataBaseLocation = path.join(__dirname, "db", "db.json");
  const dataBaseInfo = readFileAsync(dataBaseLocation);
  const parsedDataBase = JSON.parse(dataBaseInfo);
  return res.json(parsedDataBase);
});

app.post("/api/notes", function (req, res){
  const dataBaseLocation = path.join(__dirname, "db", "db.json");
  const dataBaseInfo = readFileAsync(dataBaseLocation);
  const parsedDataBase = JSON.parse(dataBaseInfo);
  const numberOfExistingNotes = parsedDataBase.length;
  const newNoteID = numberOfExistingNotes +1; 
  const newNote = new Note (newNoteID, req.body.noteTitle, req.body.noteContent);
  const parsedNewNote = newNote.getNote();
  parsedDataBase.push(parsedNewNote);
  const stringifiedDataBase = JSON.stringify(parsedDataBase);
  writeFileAsync(dataBaseLocation, stringifiedDataBase);
  return res.send(newNote);
})