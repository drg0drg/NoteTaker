const express = require("express");
const util = require("util");
const fs = require("fs");
const path = require("path");
const app = express();
//setting up port for Heroku. <process.env.PORT> --> Heroku uses it's own port.
const PORT = process.env.PORT || 8080;
const Note = require("./noteClass");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//------------------------------------------
//---------Routes to static HTML------------
//------------------------------------------
app.use(express.static(__dirname + "/public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//------------------------------------------
//---------Routes for API methods-----------
//------------------------------------------

app.get("/api/notes", async (req, res) => {
  try {
    //reading the db.json file
    const dataBaseLocation = path.join(__dirname, "db", "db.json");
    const dataBaseInfo = await readFileAsync(dataBaseLocation);
    //parsing the data in order to be returned
    const parsedDataBase = JSON.parse(dataBaseInfo);
    //return the parsed data
    return res.status(200).json(parsedDataBase);
  } catch (error) {
    console.log(error);
    return res.status(404).send("Data not found");
  }
});

//API route with delete method
app.post("/api/notes", async (req, res) => {
  try {
    //reading the db.json file
    const dataBaseLocation = path.join(__dirname, "db", "db.json");
    const dataBaseInfo = await readFileAsync(dataBaseLocation);
    const parsedDataBase = JSON.parse(dataBaseInfo);
    //use the getNewNoteID function to create new ID for the new note
    const newNoteID = getNewNoteID(parsedDataBase);
    //create new note using class "Note" passing in the title, text and the newNoteID
    const newNote = new Note(newNoteID, req.body.title, req.body.text);
    const parsedNewNote = newNote.getNote();
    parsedDataBase.push(parsedNewNote);
    const stringifiedDataBase = JSON.stringify(parsedDataBase);
    const dataBase = await writeFileAsync(
      dataBaseLocation,
      stringifiedDataBase
    );
    return res.status(200).send(newNote);
  } catch (error) {
    console.log(error);
    return res.status(404).send("Data not found");
  }
});

//API route with delete method
app.delete("/api/notes/:id", async (req, res) => {
  try {
    //Reading the db.json file
    const dataBaseLocation = path.join(__dirname, "db", "db.json");
    const dataBaseInfo = await readFileAsync(dataBaseLocation);
    const parsedDataBase = JSON.parse(dataBaseInfo);
    //store the id in a variable
    const noteId = req.params.id;
    //Filter method takes each note obj and stores into <newData> except the one with note.id == noteId (the one that is selected to be deleted)
    const newData = parsedDataBase.filter((note) => note.id !== noteId);
    const stringifiedDataBase = JSON.stringify(newData);
    await writeFileAsync(dataBaseLocation, stringifiedDataBase);
    res.status(200).send("Note has been deleted");
  } catch (error) {
    console.log(error);
    return res.status(404).send("Data not found");
  }
});

//------------------------------------------
//---------Listener for server--------------
//------------------------------------------

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});

//Function to create ID for a new note
function getNewNoteID(parsedDataBase) {
  //initialize the new note ID with zero
  let newNoteID = 0;
  //if <parsedDataBase> exists AND has at least one object
  if (parsedDataBase && parsedDataBase.length > 0) {
    //pull all the id's from all the objects and store them into IDArray
    let IDArray = parsedDataBase.map((a) => a.id);
    //Method to determine the max ID in the array
    let max = IDArray.reduce(function (a, b) {
      return Math.max(a, b);
    });
    //Always increment the noteID. Each note will have a different ID
    newNoteID = max + 1;
  } else {
    //set the note ID
    newNoteID = 1;
  }
  return newNoteID;
}
