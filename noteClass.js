
class Note {
  constructor (noteId, noteTitle, noteContent){
    this.noteId = noteId;
    this.noteTitle = noteTitle;
    this.noteContent = noteContent;
  }

  getNote() {
    const noteToBeParsed = `{"noteId": "${this.noteId}", "noteTitle": "${this.noteTitle}", "noteContent":"${this.noteContent}"}`;
    const parsedNote = JSON.parse(noteToBeParsed);
    return parsedNote;
  }
}