
class Note {
  constructor (noteId, noteTitle, noteContent){
    this.noteId = noteId;
    this.noteTitle = noteTitle;
    this.noteContent = noteContent;
  }

  returnNote() {
    const noteToBeParsed = `{"noteId": "${this.noteId}", "noteTitle": "${this.noteTitle}", "noteContent":"${this.noteContent}"}`;

    return JSON.parse(noteToBeParsed);
  }
}