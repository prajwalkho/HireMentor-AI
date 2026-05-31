import axios from 'axios';
import { axiosInstance } from './api/axios'; // Or use axiosInstance directly if configured

// Judge0 Language IDs
const LANGUAGE_MAP = {
  javascript: 93,
  python: 71,
  java: 62,
  c: 50,
  cpp: 54,
  go: 60,
  ruby: 72,
  php: 68,
  rust: 73,
  swift: 83,
  typescript: 94,
  kotlin: 78,
  bash: 46
};

export const executeCode = async (langKey, code, stdin = '') => {
  const langId = LANGUAGE_MAP[langKey.toLowerCase()];
  
  if (!langId) {
    return {
      run: {
        output: `Unsupported language: ${langKey}`,
        stdout: '',
        stderr: `Language not supported`,
        exitCode: -1
      }
    };
  }

  try {
    const { data } = await axiosInstance.post("/api/v1/run-code", {
      language_id: langId,
      source_code: code,
      stdin
    });

    // Judge0 Response Format mapping to Piston Format
    return {
      run: {
        output: data.stdout || data.stderr || data.compile_output || 'No output',
        stdout: data.stdout || '',
        stderr: data.stderr || data.compile_output || '',
        exitCode: data.status?.id === 3 ? 0 : 1 // Status 3 is "Accepted"
      }
    };
  } catch (error) {
    console.error('Code execution failed:', error?.response?.data || error.message);
    return {
      run: {
        output: error?.response?.data?.error || error.message || 'Unknown error occurred',
        stdout: '',
        stderr: error?.response?.data?.error || error.message || 'Unknown error occurred',
        exitCode: -1
      }
    };
  }
};
