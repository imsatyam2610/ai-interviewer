import { Card } from "antd";
import { MessageSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  conversationLog: { role: "interviewer" | "you"; text: string }[];
}

const TranscriptViewer: React.FC<Props> = ({ conversationLog }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [conversationLog, isOpen]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-2 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
        aria-label="Toggle Transcript"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Transcript Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[320px] z-40">
          <Card
            title="Live Transcript"
            size="small"
            className="shadow-lg"
            styles={{
              body: {
                padding: 12,
              },
            }}
          >
            <div
              ref={containerRef}
              className="min-h-[100px] max-h-[200px] overflow-y-auto bg-gray-100 p-3 rounded-lg space-y-2"
            >
              {conversationLog.length > 0 ? (
                conversationLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`text-sm ${
                      msg.role === "you"
                        ? "text-right text-blue-800"
                        : "text-left text-gray-800"
                    }`}
                  >
                    <strong>
                      {msg.role === "you" ? "You: " : "Interviewer: "}
                    </strong>
                    <span>{msg.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center">
                  Your conversation will appear here...
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default TranscriptViewer;
