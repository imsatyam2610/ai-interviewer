interface Props {
  isConnected: boolean;
  company?: string;
}

const InterviewStatus: React.FC<Props> = ({ isConnected, company }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-center">
        <h1 className="text-sm font-bold text-gray-900">
          {company} Mock Interview
        </h1>
        <p className="text-gray-600 mt-1 text-xs">
          Voice-based interview session
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default InterviewStatus;
