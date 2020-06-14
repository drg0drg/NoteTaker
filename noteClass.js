class Note {
  constructor(id, title, text) {
    this.id = id;
    this.title = title;
    this.text = text;
  }

  getNote() {
    const noteToBeParsed = `{"id": "${this.id}", "title": "${this.title}", "text":"${this.text}"}`;
    const parsedNote = JSON.parse(noteToBeParsed);
    return parsedNote;
  }

}
module.exports = Note ;