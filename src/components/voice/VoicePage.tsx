"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useVapi } from "@/hooks/useVapi";
import InterviewStatus from "./InterviewStatus";
import QuestionViewer from "./QuestionViewer";
import TranscriptViewer from "./TranscriptViewer";
import ProgressIndicator from "./ProgressIndicator";
import VoiceControls from "./VoiceControls";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
}

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  transcript: string;
}

interface VoicePageProps {
  data: any;
}

const VoicePage: React.FC<VoicePageProps> = ({ data }) => {
  const mockQuestions = data.questions.map((text: any, i: any) => ({
    id: `${i + 1}`,
    text,
  }));
  const router = useRouter();

  const [interviewState, setInterviewState] = useState<InterviewState>({
    currentQuestionIndex: 0,
    questions: mockQuestions,
    transcript: "",
  });

  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  const currentQuestion =
    interviewState.questions[interviewState.currentQuestionIndex];
  const isLastQuestion =
    interviewState.currentQuestionIndex === interviewState.questions.length - 1;

  useEffect(() => {
    const nextQ = interviewState.questions[interviewState.currentQuestionIndex];
    if (nextQ) {
      sayQuestion(nextQ.text);
    }
  }, [interviewState.currentQuestionIndex]);

  const skipQuestion = useCallback(() => {
    setInterviewState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex === prev.questions.length) {
        endInterview();
        router.push("/voice/" + data.interview_id + "/result");
        return prev;
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        transcript: "",
      };
    });

    toast.info("Question Skipped", {
      description: "Moving to the next question.",
    });

    setTranscript("");
  }, []);

  const {
    isConnected,
    activeUser,
    isMuted,
    connect,
    disconnect,
    togglePauseResume,
    toggleMicPermission,
    transcript,
    micPermission,
    conversationLog,
    sayQuestion,
    setTranscript,
  } = useVapi({
    onFirstMessage: `Hi! I'm your Interviewer today from ${data?.company} . Let's begin your ${data?.company} mock interview.`,
    getCurrentQuestion: () => currentQuestion?.text || null,
    onSkipQuestion: skipQuestion,
  });

  useEffect(() => {
    if (transcript) {
      setInterviewState((prev) => ({ ...prev, transcript }));
    }
  }, [transcript]);

  const startInterview = useCallback(async () => {
    try {
      await connect();
      toast.success("Interview Started", {
        description: "You can now answer the questions using your voice.",
      });
    } catch (error) {
      toast.error("Connection Failed", {
        description: "Unable to connect to voice service. Please try again.",
      });
    }
  }, [connect]);

  const endInterview = useCallback(async () => {
    try {
      await disconnect();
      setInterviewState((prev) => ({
        ...prev,
        transcript: "",
      }));
      toast.success("Interview Ended", {
        description: "Thank you for completing the interview.",
      });

      router.push("/voice/" + data.interview_id + "/result");
    } catch (error) {
      console.error("Failed to end interview:", error);
    }
  }, [disconnect]);

  const submitAnswer = useCallback(async () => {
    if (!interviewState.transcript.trim()) {
      toast.warning("No Answer Detected", {
        description: "Please provide an answer before submitting.",
      });

      return;
    }

    setIsProcessingAnswer(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: data.interview_id,
          questionId: currentQuestion.id,
          answer: interviewState.transcript,
          questionText: currentQuestion.text,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit answer");

      const feedback = await response.json();

      toast.success("Answer Submitted", {
        description: "Your answer has been recorded and analyzed.",
      });

      if (isLastQuestion) {
        await endInterview();
        router.push("/voice/" + data.interview_id + "/result");
        toast.success("Interview Complete", {
          description: "You have completed all questions. Thank you!",
        });
      } else {
        setInterviewState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          transcript: "",
        }));
        setTranscript("");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Submission Failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsProcessingAnswer(false);
    }
  }, [
    interviewState.transcript,
    currentQuestion,
    isLastQuestion,
    endInterview,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <InterviewStatus company={data.company} isConnected={isConnected} />

        {/* {currentQuestion && (
          <QuestionViewer
            questionText={currentQuestion.text}
            currentIndex={interviewState.currentQuestionIndex}
            totalQuestions={interviewState.questions.length}
          />
        )} */}
        <VoiceControls
          company={data.company}
          isInterviewActive={isConnected}
          activeUser={activeUser}
          submitAnswer={submitAnswer}
          isProcessingAnswer={isProcessingAnswer}
          disableSubmit={
            !isConnected ||
            !interviewState.transcript.trim() ||
            isProcessingAnswer
          }
        />

        <TranscriptViewer conversationLog={conversationLog} />

        <ProgressIndicator
          current={interviewState.currentQuestionIndex}
          total={interviewState.questions.length}
          isConnected={isConnected}
          onStart={startInterview}
          onEnd={endInterview}
          isMuted={isMuted}
          toggleMute={togglePauseResume}
          micPermission={micPermission}
          toggleMicPermission={toggleMicPermission}
        />
      </div>
    </div>
  );
};

export default VoicePage;
