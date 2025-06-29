import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Play,
  Star,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeedbackPageProps {
  userStats: any;
  interviewTypes: any;
  selectedType: any;
  setSelectedType: any;
  isExecuting: boolean;
  handleInterviewStart: any;
  getDifficultyColor: any;
}
export default function DashboardMain({
  userStats,
  interviewTypes,
  selectedType,
  setSelectedType,
  isExecuting,
  handleInterviewStart,
  getDifficultyColor,
}: FeedbackPageProps) {
  return (
    <div className="lg:col-span-3">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.totalInterviews ?? "--"}{" "}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.averageScore ?? "--"}%
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.streak ?? "--"}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Best Category</p>
                <p className="text-sm font-semibold text-gray-900">
                  {userStats?.bestCategory ?? "--"}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Types */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Choose Your Interview Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewTypes.map((interview: any) => (
            <Card
              key={interview.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedType === interview.id ? "ring-2 ring-blue-500" : ""
              } ${!interview.isAvailable ? "opacity-60" : ""}`}
              onClick={() =>
                interview.isAvailable && setSelectedType(interview.id)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {interview.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {interview.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={getDifficultyColor(interview.difficulty)}
                        >
                          {interview.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {interview.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!interview.isAvailable && (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{interview.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Features:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {interview.features.map((feature: any, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {interview.isAvailable && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => handleInterviewStart(interview)}
                      disabled={isExecuting}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Interview
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
