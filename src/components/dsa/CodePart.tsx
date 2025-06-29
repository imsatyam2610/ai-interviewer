import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MonacoEditor from "./monaco-editor";
import {
  Brain,
  CheckCircle,
  Code,
  Loader2,
  RotateCcw,
  Terminal,
  XCircle,
  Zap,
} from "lucide-react";

interface Props {
  testResults: any;
  executionOutput: string;
  isExecuting: boolean;
  setCode: any;
  setSelectedLanguage: any;
  code: string;
  selectedLanguage: string;
  handleReset: () => void;
  handleRunCode: () => void;
  isRunning: boolean;
}

const CodePart: React.FC<Props> = ({
  testResults,
  executionOutput,
  isExecuting,
  setCode,
  setSelectedLanguage,
  code,
  selectedLanguage,
  handleReset,
  handleRunCode,
  isRunning,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Editor
            </div>
            <div className="flex gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonacoEditor
            value={code}
            onChange={(value) => setCode(value || "")}
            language={selectedLanguage}
            height="300px"
          />
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleRunCode}
              disabled={isExecuting || !isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isExecuting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Terminal className="w-4 h-4" />
              )}
              {isExecuting ? "Running..." : "Run Code"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Execution Output */}
      {executionOutput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              {executionOutput}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((testCase: any) => (
                <div
                  key={testCase.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      Test Case {testCase.id}
                    </span>
                    <div className="flex items-center gap-2">
                      {testCase.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          testCase.passed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {testCase.status ||
                          (testCase.passed ? "Passed" : "Failed")}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-600">Input:</span>
                      <code className="ml-2 bg-gray-100 px-1 rounded">
                        {JSON.stringify(testCase.input)}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected:</span>
                      <code className="ml-2 bg-gray-100 px-1 rounded">
                        {testCase.expectedOutput}
                      </code>
                    </div>
                    {testCase.actualOutput && (
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <code
                          className={`ml-2 px-1 rounded ${
                            testCase.passed ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {testCase.actualOutput}
                        </code>
                      </div>
                    )}
                    {testCase.executionTime && (
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Time: {testCase.executionTime}</span>
                        <span>Memory: {testCase.memory}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodePart;
