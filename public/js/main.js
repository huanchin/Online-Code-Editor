const socket = io();
const openEditorButton = document.getElementById("open-editor");

openEditorButton.addEventListener("click", () => {
  socket.emit("joinRoom", "room1");
});

socket.on("codeUpdate", (code) => {
  //   if (
  //     window.editor &&
  //     !window.editor.hasFocus() &&
  //     window.editor.getValue() !== code
  //   ) {
  //     window.isUpdating = true;
  //     window.editor.setValue(code);
  //     window.isUpdating = false;
  //   }
  if (window.editor && window.editor.getValue() !== code) {
    window.isUpdating = true;
    window.editor.setValue(code);
    window.isUpdating = false;
  }
});
