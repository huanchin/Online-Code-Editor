const editorElement = document.getElementById("editor");
const outputElement = document.getElementById("output");
const languageSelect = document.getElementById("language-select");
const runButton = document.getElementById("run-button");

// Initialize Yjs document and websocket provider
const ydoc = new Y.Doc();
const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "editor-room",
  ydoc
);
const yText = ydoc.getText("codemirror");

// Initialize CodeMirror
window.editor = CodeMirror(editorElement, {
  mode: "javascript",
  lineNumbers: true,
  theme: "default",
});

// Bind Yjs document to CodeMirror
const binding = new CodemirrorBinding(yText, window.editor, provider.awareness);

// Change language mode based on selection
languageSelect.addEventListener("change", () => {
  const language = languageSelect.value;
  let mode = "javascript";
  if (language === "python") {
    mode = "python";
  } else if (language === "cpp") {
    mode = "text/x-c++src";
  }
  window.editor.setOption("mode", mode);
});

// Event listener for the run button
runButton.addEventListener("click", () => {
  const code = window.editor.getValue();
  const language = languageSelect.value;
  socket.emit("runCode", code, language);
});

// Receiving output from the server
socket.on("output", (output) => {
  outputElement.innerHTML = output.replace(/\n/g, "<br>");
});
