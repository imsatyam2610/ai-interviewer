import React, { useState } from "react";
import {
  CirclePlay,
  Mic,
  MicOff,
  PauseCircle,
  PlayCircle,
  StopCircle,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  current: number;
  total: number;
  isConnected: boolean;
  isMuted: boolean;
  onStart: () => void;
  onEnd: () => void;
  toggleMute: () => void;
  toggleMicPermission: () => void;
  micPermission: boolean;
  submitAnswer: () => void;
}

const ProgressIndicator: React.FC<Props> = ({
  current,
  total,
  isConnected,
  isMuted,
  onStart,
  onEnd,
  toggleMute,
  toggleMicPermission,
  micPermission,
  submitAnswer,
}) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full sm:max-w-80 max-w-60 px-2">
        <div className="bg-white/80 shadow-xl border border-gray-200 rounded-full flex justify-around items-center py-2 sm:px-6">
          {/* Mic Toggle */}
          <button
            onClick={toggleMicPermission}
            title="Toggle Mic"
            className={`flex cursor-pointer items-center gap-2 px-3 py-3 rounded-full text-white shadow-md transition ${
              micPermission
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {micPermission ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          {/* Pause / Resume */}
          {isConnected && (
            <button
              onClick={toggleMute}
              disabled={!isConnected || !micPermission}
              title={isMuted ? "Resume Interview" : "Pause Interview"}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-white shadow-md transition ${
                isMuted
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isMuted ? (
                <CirclePlay className="w-5 h-5" />
              ) : (
                <PauseCircle className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {isMuted ? "Resume" : "Pause"}
              </span>
            </button>
          )}

          {/* Start or Confirm End */}
          {isConnected ? (
            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogTrigger asChild>
                <button
                  title="End Interview"
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 shadow-md transition"
                >
                  <StopCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">End</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Interview?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end your <strong>Interview</strong>. Are you sure
                    you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      submitAnswer();
                      onEnd();
                    }}
                  >
                    End
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <button
              onClick={onStart}
              title="Start Interview"
              className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full text-white bg-green-600 hover:bg-green-700 shadow-md transition"
            >
              <PlayCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Start</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProgressIndicator;
