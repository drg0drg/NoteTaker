//Note class to create new notes
class Note {
  constructor(id, title, text) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
  //method to return the note as an object
  //this will be used in <app.post>
  getNote() {
    const noteToBeParsed = `{"id": "${this.id}", "title": "${this.title}", "text":"${this.text}"}`;
    const parsedNote = JSON.parse(noteToBeParsed);
    return parsedNote;
  }

}
module.exports = Note ;