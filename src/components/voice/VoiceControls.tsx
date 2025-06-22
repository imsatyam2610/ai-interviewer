import React from "react";

interface VoiceControlsProps {
  isInterviewActive: boolean;
  activeUser: boolean;
  submitAnswer: () => void;
  isProcessingAnswer: boolean;
  disableSubmit: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isInterviewActive,
  activeUser,
  submitAnswer,
  isProcessingAnswer,
  disableSubmit,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl text-center w-full max-w-4xl mx-auto mt-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="relative bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
          {isInterviewActive && !activeUser && (
            <span className="absolute top-1/3 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 opacity-60 animate-ping z-0" />
          )}
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="AI Interviewer"
            className="w-20 h-20 rounded-full mb-2 shadow"
          />
          <h2 className="text-base font-medium text-gray-800">
            AI Interviewer
          </h2>
        </div>

        {/* (User) */}
        <div className="relative bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
          {isInterviewActive && activeUser && (
            <span className="absolute top-1/3 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 opacity-60 animate-ping z-0" />
          )}
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Satyam"
            className="w-20 h-20 rounded-full mb-2 shadow"
          />
          <h2 className="text-base font-medium text-gray-800">Satyam</h2>
        </div>
      </div>

      {/* Submit Answer */}
      <button
        onClick={submitAnswer}
        disabled={disableSubmit}
        className={`w-full max-w-xs mx-auto py-2 px-4 rounded-md text-white font-semibold transition 
        ${
          disableSubmit
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow"
        }`}
      >
        {isProcessingAnswer ? "Processing..." : "Submit Answer"}
      </button>
    </div>
  );
};

export default VoiceControls;
