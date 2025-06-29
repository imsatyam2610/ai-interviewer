import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trophy, Users } from "lucide-react";
import Link from "next/link";

interface FeedbackPageProps {
  recentInterviews: any;
  getScoreColor: any;
  formatTime: any;
}
export default function DashboardSidebar({
  recentInterviews,
  getScoreColor,
  formatTime,
}: FeedbackPageProps) {
  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterviews.map((interview: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{interview.id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(interview.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${getScoreColor(
                        interview.score
                      )}`}
                    >
                      {interview.score}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(interview.duration)}
                    </p>
                  </div>
                </div>
                {index < recentInterviews.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
          <Link href="/dashboard/interviews">
            <Button
              variant="outline"
              className="w-full mt-4 cursor-pointer"
              size="sm"
            >
              View All History
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Tips & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interview Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Practice STAR Method
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Structure your answers: Situation, Task, Action, Result
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">
                Test Your Setup
              </p>
              <p className="text-xs text-green-700 mt-1">
                Ensure your microphone and camera work properly
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Stay Calm</p>
              <p className="text-xs text-purple-700 mt-1">
                Take deep breaths and speak clearly and confidently
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Study Group
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Practice
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Achievements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
