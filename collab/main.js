import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import io from "socket.io-client";

const editorElement = document.getElementById("editor");
const outputElement = document.getElementById("output");
const languageSelect = document.getElementById("language-select");
const runButton = document.getElementById("run-button");

// Initialize Yjs document
const ydoc = new Y.Doc();
const socket = io();

// Initialize CodeMirror
window.editor = CodeMirror(editorElement, {
  mode: "javascript",
  lineNumbers: true,
  theme: "default",
});

const yText = ydoc.getText("codemirror");

// Bind Yjs document to CodeMirror
const binding = new CodemirrorBinding(yText, window.editor);

// Join a room and sync the Yjs document
const openEditorButton = document.getElementById("open-editor");
openEditorButton.addEventListener("click", () => {
  socket.emit("joinRoom", "room1");

  socket.on("syncDoc", (update) => {
    Y.applyUpdate(ydoc, new Uint8Array(update));
  });

  socket.on("docUpdate", (update) => {
    Y.applyUpdate(ydoc, new Uint8Array(update));
  });

  ydoc.on("update", (update) => {
    socket.emit("docUpdate", Array.from(update));
  });
});

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
