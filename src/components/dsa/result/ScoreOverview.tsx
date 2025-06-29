import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Code, CheckCircle } from "lucide-react";

interface Props {
  getScoreColor: any;
  formatTime: any;
  results: any;
  getScoreBadgeColor: any;
  passedTests: number;
  totalTests: number;
}

const ScoreOverview: React.FC<Props> = ({
  getScoreColor,
  formatTime,
  results,
  getScoreBadgeColor,
  passedTests,
  totalTests,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 sm:gap-6 mb-8 gap-2">
      <Card className="text-center">
        <CardContent className="p-6">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <div
            className={`text-3xl font-bold mb-1 ${getScoreColor(
              results.score
            )}`}
          >
            {results.score}%
          </div>
          <p className="text-sm text-gray-600">Overall Score</p>
          <Badge className={`mt-2 ${getScoreBadgeColor(results.score)}`}>
            {results.score >= 80
              ? "Excellent"
              : results.score >= 60
              ? "Good"
              : "Needs Improvement"}
          </Badge>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="p-6">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {passedTests}/{totalTests}
          </div>
          <p className="text-sm text-gray-600">Tests Passed</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(passedTests / totalTests) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="p-6">
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatTime(results.timeSpent)}
          </div>
          <p className="text-sm text-gray-600">Time Spent</p>
          <p className="text-xs text-gray-500 mt-1">
            {results.timeSpent < 1800
              ? "Fast"
              : results.timeSpent < 2700
              ? "Average"
              : "Slow"}
          </p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="p-6">
          <Code className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {results.language}
          </div>
          <p className="text-sm text-gray-600">Language Used</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {results.code.split("\n").length} lines of code
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default ScoreOverview;
