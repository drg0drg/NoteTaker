const express = require("express");
const util = require("util");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;
const Note = require("./noteClass");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//------------------------------------------
//---------Routes to static HTML------------
//------------------------------------------
app.use(express.static(__dirname + "/public"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//------------------------------------------
//---------Routes for API methods-----------
//------------------------------------------

app.get("/api/notes", async function (req, res) {
  try {
    const dataBaseLocation = path.join(__dirname, "db", "db.json");
    const dataBaseInfo = await readFileAsync(dataBaseLocation);
    const parsedDataBase = JSON.parse(dataBaseInfo);
    return res.json(parsedDataBase);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/notes", async function (req, res) {
  try {
    const dataBaseLocation = path.join(__dirname, "db", "db.json");
    const dataBaseInfo = await readFileAsync(dataBaseLocation);
    const parsedDataBase = JSON.parse(dataBaseInfo);
    const numberOfExistingNotes = parsedDataBase.length;
    const newNoteID = numberOfExistingNotes + 1;
    const newNote = new Note(newNoteID, req.body.title, req.body.text);
    const parsedNewNote = newNote.getNote();
    parsedDataBase.push(parsedNewNote);
    const stringifiedDataBase = JSON.stringify(parsedDataBase);
    const dataBase = await writeFileAsync(
      dataBaseLocation,
      stringifiedDataBase
    );
    return res.send(newNote);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log(noteId);
    const rawData = await readFileAsync("./db/db.json", "utf-8");
    console.log(rawData);
    const parseData = JSON.parse(rawData);
    // const {id} = req.params.id;
    // console.log(id)
    const newData = parseData.filter((note) => note.id !== noteId);
    console.log(newData);
    const newDataReorder = newData;

    // for (let i = noteId -1; i<newData.length -1; i++) {
    //   console.log(newData[i]);
    //   newData[i] = newData[i+1]
    //   newData[i].id = parseInt(i)+1
     
    // }

    for (let i = noteId -1; i<newData.length -1; i++) {
      newDataReorder[i].id = 
    }

    
    console.log(newData)
    // newDataReordered.push(newData)
    fs.writeFile("./db/db.json", JSON.stringify(newData), (err) => {
      if (err) console.log(err);
      res.json(newData);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
