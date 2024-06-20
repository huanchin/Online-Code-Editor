const editorElement = document.getElementById("editor");
const outputElement = document.getElementById("output");
const languageSelect = document.getElementById("language-select");
const runButton = document.getElementById("run-button");

// Initialize CodeMirror
window.editor = CodeMirror(editorElement, {
  mode: "javascript",
  lineNumbers: true,
  theme: "default",
});

window.isUpdating = false;

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

// Event listener for editor changes
window.editor.on("change", () => {
  if (!window.isUpdating) {
    const code = window.editor.getValue();
    socket.emit("codeChange", code);
  }
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
