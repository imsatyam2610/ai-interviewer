import { Mic, Lightbulb, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  mockProblem: any;
  showHints: boolean;
  setShowHints: any;
  currentHint: number;
  voiceTranscript: string;
  showNextHint: () => void;
}

const ProblemPart: React.FC<Props> = ({
  mockProblem,
  showHints,
  setShowHints,
  currentHint,
  voiceTranscript,
  showNextHint,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Problem Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {mockProblem.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProblem.examples.map((example: any, index: any) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-sm text-gray-600">
                      Input:
                    </span>
                    <code className="ml-2 text-sm bg-white px-2 py-1 rounded">
                      {JSON.stringify(example.input)}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">
                      Output:
                    </span>
                    <code className="ml-2 text-sm bg-white px-2 py-1 rounded">
                      {example.output}
                    </code>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        Explanation:
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {mockProblem.constraints.map((constraint: any, index: any) => (
              <li
                key={index}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <code className="bg-gray-100 px-1 rounded text-xs">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Voice Transcript */}
      {voiceTranscript && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">{voiceTranscript}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Hints
            </div>
            <Button
              onClick={() => setShowHints(!showHints)}
              variant="outline"
              size="sm"
            >
              {showHints ? "Hide" : "Show"} Hints
            </Button>
          </CardTitle>
        </CardHeader>
        {showHints && (
          <CardContent>
            <div className="space-y-3">
              {mockProblem.hints
                .slice(0, currentHint + 1)
                .map((hint: any, index: any) => (
                  <div
                    key={index}
                    className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400"
                  >
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Hint {index + 1}:</span>{" "}
                      {hint}
                    </p>
                  </div>
                ))}
              {currentHint < mockProblem.hints.length - 1 && (
                <Button onClick={showNextHint} variant="outline" size="sm">
                  Show Next Hint
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ProblemPart;
