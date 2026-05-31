import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const PracticalOutput = ({ output, isError, isLoading, executionTime }) => {
  return (
    <div className={`flex-1 p-4 rounded-lg border-2 overflow-auto ${
      isLoading ? "border-blue-400 bg-blue-50" :
      isError ? "border-red-400 bg-red-50" :
      output ? "border-green-400 bg-green-50" :
      "border-gray-300 bg-gray-50"
    }`}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-blue-600">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
          <p>Executing code...</p>
        </div>
      ) : output ? (
        <>
          <div className="flex items-center mb-3 pb-2 border-b">
            {isError ? (
              <FaExclamationTriangle className="text-red-500 mr-2" />
            ) : (
              <FaCheckCircle className="text-green-500 mr-2" />
            )}
            <span className={`font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
              {isError ? "Execution Failed" : "Execution Successful"}
            </span>
          </div>
          <pre className={`font-mono text-sm whitespace-pre-wrap ${
            isError ? "text-red-600" : "text-gray-800"
          }`}>
            {output}
          </pre>
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="mb-2">Click "Run Code" to execute your program</p>
            <p className="text-sm text-gray-400">
              Results will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticalOutput;