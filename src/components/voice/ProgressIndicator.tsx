import React from "react";
import {
  CirclePlay,
  Mic,
  MicOff,
  PauseCircle,
  PlayCircle,
  StopCircle,
} from "lucide-react";

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
}) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <>
      {/* Floating Control Bar */}
      <div className="fixed bottom-0.5 left-1/2 -translate-x-1/2 z-50 w-full sm:max-w-80 max-w-60 px-2">
        <div className="bg-white/80 shadow-xl border border-gray-200 rounded-full flex justify-around items-center py-2 sm:px-6">
          {/* Mute / Unmute */}
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
          {/* Pause / Resume Button */}
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

          {/* Start / End */}
          <button
            onClick={isConnected ? onEnd : onStart}
            title={isConnected ? "End Interview" : "Start Interview"}
            className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full text-white shadow-md transition ${
              isConnected
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isConnected ? (
              <>
                <StopCircle className="w-5 h-5" />
                <span className="hidden sm:inline">End</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Start</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar at Top or Inline */}
      <div className="w-full max-w-2xl mx-auto mt-2">
        <div className="flex justify-between px-2 text-sm text-gray-500">
          <span>Progress</span>
          <span>
            {current + 1}/{total}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default ProgressIndicator;
