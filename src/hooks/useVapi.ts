import { useState, useCallback, useRef, useEffect } from "react";
import Vapi from "@vapi-ai/web";

interface UseVapiOptions {
  onFirstMessage?: string;
  getCurrentQuestion?: () => string | null;
  onSkipQuestion?: () => void;
}

export const useVapi = (options?: UseVapiOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [micPermission, setMicPermission] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [activeUser, setActiveUser] = useState(false);
  const [conversationLog, setConversationLog] = useState<
    { role: "interviewer" | "you"; text: string }[]
  >([]);

  const vapiRef = useRef<any>(null);

  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        setMicPermission(status.state === "granted");

        status.onchange = () => {
          setMicPermission(status.state === "granted");
        };
      });
  }, []);

  const connect = useCallback(
    async (company: any) => {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
      vapiRef.current = vapi;

      const assistantOptions = {
        name: "AI Interviewer",
        firstMessage:
          options?.onFirstMessage ??
          "Hi, I’m your Interviewer today. Let’s begin your mock interview!",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You're an interviewer at ${company}, conducting a mock technical interview for a Computer Science role.

Ask only **technical questions** related to:
- Data Structures and Algorithms
- Operating Systems
- DBMS
- Computer Networks
- OOPs
- System Design (optional)

Start with a brief introduction (1-2 HR questions max), and then strictly move to technical questions only. Do not ask general HR questions beyond that.

Ask one question at a time and wait for the candidate's answer. Avoid giving hints or answers yourself.
`,
            },
          ],
        },
      };

      vapi.on("call-start", () => {
        setIsConnected(true);
        setTranscript("");

        if (options?.getCurrentQuestion) {
          const q = options.getCurrentQuestion();
          if (q) {
            vapi.say(q);
          }
        }
      });

      vapi.on("call-end", () => {
        setIsConnected(false);
        setTranscript("");
      });

      vapi.on("message", (msg: any) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          const lowerTranscript = msg.transcript.toLowerCase().trim();

          const speaker = msg.role === "assistant" ? "interviewer" : "you";
          if (msg.role == "user" && msg.transcriptType === "final") {
            setTranscript((prev) =>
              prev
                ? `${prev.trim()} ${msg.transcript.trim()}`
                : msg.transcript.trim()
            );
          }
          setConversationLog((prev) => [
            ...prev,
            { role: speaker, text: msg.transcript },
          ]);
          if (
            lowerTranscript.includes("skip") ||
            lowerTranscript.includes("skip question") ||
            lowerTranscript.includes("next question")
          ) {
            options?.onSkipQuestion?.();
            setTranscript("");
            return;
          }
        }
      });

      vapi.on("speech-start", () => setActiveUser(false));
      vapi.on("speech-end", () => setActiveUser(true));

      try {
        //@ts-ignore
        await vapi.start(assistantOptions);
      } catch (err) {
        console.error("❌ Failed to start Vapi:", err);
      }
    },
    [options?.onFirstMessage, options?.getCurrentQuestion]
  );

  const disconnect = useCallback(async () => {
    if (vapiRef.current) {
      try {
        await vapiRef.current.stop();
        setTranscript("");
        setIsConnected(false);
      } catch (err) {
        console.error("❌ Failed to disconnect:", err);
      }
    }
  }, []);

  const togglePauseResume = useCallback(() => {
    const call = vapiRef.current?.call;
    if (!call) {
      console.warn("🔇 Mute toggle skipped: call not active.");
      return;
    }
    const muted = !vapiRef.current.isMuted();
    vapiRef.current.setMuted(muted);
    setIsMuted(muted);
  }, []);

  const toggleMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Close mic immediately
      setMicPermission(true);
      if (vapiRef.current) {
        const muted = !vapiRef.current.isMuted();
        vapiRef.current.setMuted(muted);
        setIsMuted(muted);
        setMicPermission(!muted);
      }
    } catch (err) {
      setMicPermission(false);
    }
  };

  const sayQuestion = (text: string) => {
    if (vapiRef.current && isConnected && text) {
      vapiRef.current.say(text);
    }
  };

  return {
    isConnected,
    isMuted,
    activeUser,
    transcript,
    conversationLog,
    connect,
    disconnect,
    micPermission,
    togglePauseResume,
    toggleMicPermission,
    sayQuestion,
    setTranscript,
  };
};
