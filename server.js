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
    // const newDataIdArray = newData;

    const newNoteID = getNewNoteID(parsedDataBase);
    // let IDArray = parsedDataBase.map(a => a.id);
    
    // let max = IDArray.reduce(function(a, b) {
    //   return Math.max(a, b);
    // });
    
    // const newNoteID = max + 1;

    // function getNewNoteID (parsedDataBase) {
    //   let IDArray = parsedDataBase.map(a => a.id);
    
    //   let max = IDArray.reduce(function(a, b) {
    //     return Math.max(a, b);
    //   });
  
    //   const newNoteID = max + 1;
    //   return newNoteID;

    // }


    const newNote = new Note(newNoteID, req.body.title, req.body.text);
    const parsedNewNote = newNote.getNote();
    parsedDataBase.push(parsedNewNote);
    const stringifiedDataBase = JSON.stringify(parsedDataBase);
    const dataBase = await writeFileAsync(
      dataBaseLocation,
      stringifiedDataBase
    );

    // status(200).send("success")
    // return res.status(200).send(newNote);
    return res.send(newNote);
  } catch (error) {
    console.log(error);
    // return res.status(404).send("Not Found");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const dataBaseLocation = path.join(__dirname, "db", "db.json");
    const dataBaseInfo = await readFileAsync(dataBaseLocation);
    const parsedDataBase = JSON.parse(dataBaseInfo);
    const noteId = req.params.id;
    const newData = parsedDataBase.filter((note) => note.id !== noteId);
    console.log(newData);
    // const newDataReorder = newData;
//     const newDataIdArray = newData
//     let newDataIdArray = newData.map(a => a.id);

//     var max = newDataIdArray.reduce(function(a, b) {
//     return Math.max(a, b);
// });



    // for (let i = noteId -1; i<newData.length -1; i++) {
    //   newData[i] = newData[i+1]
    //   newData[i].id = parseInt(i)+1

    // }

    // for (let i = noteId -1; i<newData.length -1; i++) {
    //   newDataReorder[i].id = 1
    // }

    // for (i=0; i<newData.length; i++){
      
    // }

    console.log(newData);
    // newDataReordered.push(newData)
    const stringifiedDataBase = JSON.stringify(newData);
    await writeFileAsync(dataBaseLocation, stringifiedDataBase);
    res.json(newData);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

// app.delete("/api/notes/:id", async (req, res) => {
//   Note 
//   .removeNote(req.params.id)
//   .then(()=> res.json({ ok:"note removed" }))
//   .catch(err => res.status(500).json(error));
// });


function getNewNoteID (parsedDataBase) {
  let newNoteID = 0;
  if (parsedDataBase && parsedDataBase.length>0) {
    let IDArray = parsedDataBase.map(a => a.id);

    let max = IDArray.reduce(function(a, b) {
      return Math.max(a, b);
    });
  
    newNoteID = max + 1;
    
  } else { 
    newNoteID = 1;
  }
  return newNoteID;

}
