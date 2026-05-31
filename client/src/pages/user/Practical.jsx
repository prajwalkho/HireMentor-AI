import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../../component/LanguageSelector";
import { CODE_SNIPPETS } from "../../constants";
import Output from "../../component/PracticalOutput";
import { FaPlay, FaTrashAlt, FaStop, FaLightbulb } from "react-icons/fa";
import { executeCode } from "../../api";

const Practical = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    if (editorRef.current) {
      editorRef.current.setValue(CODE_SNIPPETS[language]);
    }
  };

  const clearCode = () => {
    setValue("");
    setOutput("");
    setExecutionTime(null);
    setIsError(false);
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  };

  const runCode = async () => {
    if (!editorRef.current) return;

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) {
      alert("Your code editor is empty. Please add some code to run.");
      return;
    }

    try {
      setIsRunning(true);
      setOutput("");
      setIsError(false);
      setExecutionTime(null);
      const startTime = performance.now();

      const result = await executeCode(language, sourceCode);

      const endTime = performance.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2) + "s");

      if (result?.run) {
        const outputText = result.run.output || result.run.stderr || "No output";
        setOutput(outputText);
        setIsError(Boolean(result.run.stderr));
      } else {
        setOutput(result.output || "Execution failed: No response from the server.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("An unexpected error occurred during execution. Please try again.");
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Online Code Runner
        </h1>
        <p className="text-sm text-indigo-500 flex items-center justify-center">
          <FaLightbulb className="mr-2 text-yellow-500" />
          Select a language, write your code, and click <strong className="mx-1 text-indigo-700">"Execute"</strong> to see the output.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Panel - Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <LanguageSelector language={language} onSelect={onSelect} />
            <div className="flex gap-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`flex items-center px-4 py-2 rounded-md shadow transition-all ${
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
                }`}
              >
                {isRunning ? (
                  <>
                    <FaStop className="mr-2 animate-pulse" />
                    Executing...
                  </>
                ) : (
                  <>
                    <FaPlay className="mr-2" />
                    Execute
                  </>
                )}
              </button>
              <button
                onClick={clearCode}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-md shadow font-medium"
              >
                <FaTrashAlt className="mr-2" />
                Reset
              </button>
            </div>
          </div>

          <div className="flex-1 h-[500px] border-2 border-indigo-200 rounded-lg overflow-hidden shadow-lg">
            <Editor
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 15,
                wordWrap: "on",
                autoClosingBrackets: "always",
              }}
              height="350px"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value || "")}
            />
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-indigo-700">
              Execution Output
            </h2>
            {executionTime && (
              <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                Time: {executionTime}
              </span>
            )}
          </div>

          <div className="flex-1 h-[500px] border-2 border-indigo-200 rounded-lg p-4 bg-white shadow-lg overflow-auto">
            <Output
              height="100%"
              output={output}
              isError={isError}
              isLoading={isRunning}
              executionTime={executionTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practical;