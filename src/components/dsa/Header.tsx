import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Send,
  Clock,
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  mockProblem: any;
  getDifficultyColor: any;
  isVoiceActive: boolean;
  startVoiceInterview: () => void;
  toggleMic: () => void;
  isMicOn: boolean;
  stopVoiceInterview: () => void;
  isInterviewerSpeaking: boolean;
  timeLeft: number;
  formatTime: any;
  isRunning: boolean;
  pauseTimer: () => void;
  startTimer: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const DSAHeader: React.FC<Props> = ({
  mockProblem,
  getDifficultyColor,
  isVoiceActive,
  startVoiceInterview,
  toggleMic,
  isMicOn,
  stopVoiceInterview,
  isInterviewerSpeaking,
  timeLeft,
  formatTime,
  isRunning,
  startTimer,
  pauseTimer,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex max-sm:flex-col gap-3 justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="max-sm:hidden">Back to Lobby</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {mockProblem.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getDifficultyColor(mockProblem.difficulty)}>
                  {mockProblem.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">
                  Data Structures & Algorithms
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Voice Interview Controls */}
            <div className="flex items-center gap-2 border-r pr-4">
              {!isVoiceActive ? (
                <Button
                  onClick={startVoiceInterview}
                  variant="outline"
                  size="sm"
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Start Voice
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={toggleMic}
                    variant={isMicOn ? "default" : "destructive"}
                    size="sm"
                  >
                    {isMicOn ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={stopVoiceInterview}
                    variant="outline"
                    size="sm"
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {isInterviewerSpeaking && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">AI Speaking...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span
                className={`font-mono text-lg font-bold ${
                  timeLeft < 300 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={startTimer} size="sm">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
              )}
              {isRunning && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAHeader;
