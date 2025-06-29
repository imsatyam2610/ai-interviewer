"use client";

import { useEffect, useState } from "react";
import { Mic, Code, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "./Sidebar";
import DashboardHeader from "./Header";
import DashboardMain from "./MainContent";

interface InterviewType {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: React.ReactNode;
  path: string;
  features: string[];
  isAvailable: boolean;
}

interface UserStats {
  totalInterviews: number;
  averageScore: number;
  bestCategory: string;
  streak: number;
}

const interviewTypes: InterviewType[] = [
  {
    id: "voice",
    title: "Voice Interview",
    description:
      "Practice behavioral and technical questions with AI-powered voice interaction",
    duration: "30-45 min",
    difficulty: "Intermediate",
    icon: <Mic className="w-6 h-6" />,
    path: "/",
    features: [
      "Real-time voice interaction",
      "Live transcript",
      "Instant feedback",
      "Question skipping",
    ],
    isAvailable: true,
  },
  {
    id: "coding",
    title: "DSA Interview",
    description:
      "Solve data structures and algorithms problems in a timed environment",
    duration: "60-90 min",
    difficulty: "Beginner",
    icon: <Code className="w-6 h-6" />,
    path: "dsa",
    features: [
      "Multiple languages",
      "Code execution",
      "Complexity analysis",
      "Hints system",
    ],
    isAvailable: true,
  },
  {
    id: "system-design",
    title: "System Design",
    description:
      "Design scalable systems with interactive diagramming and AI guidance",
    duration: "45-60 min",
    difficulty: "Advanced",
    icon: <BarChart3 className="w-6 h-6" />,
    path: "/interview/system-design",
    features: [
      "Interactive whiteboard",
      "Component library",
      "Scalability analysis",
      "Best practices",
    ],
    isAvailable: false,
  },
];

export default function DashboardPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleInterviewStart = async (type: InterviewType) => {
    setIsExecuting(true);
    if (type.id === "coding") {
      try {
        const res = await fetch("/api/dsa-interview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data?.interviewId) {
          router.push(`/dsa/${data.interviewId}`);
        } else {
          alert("Failed to create interview session.");
        }
      } catch (error) {
        console.error("Failed to start DSA Interview:", error);
      }
    } else {
      // For other types like voice or system design
      router.push(type.path);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/users/stats");
      const data = await res.json();
      setUserStats(data);
    };

    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/interview/history?page=1&limit=3");
        const data = await res.json();
        console.log("data", data);
        setRecentInterviews(data.data || []);
      } catch (err) {
        console.error("Failed to fetch recent interviews", err);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <DashboardMain
            userStats={userStats}
            interviewTypes={interviewTypes}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            isExecuting={isExecuting}
            handleInterviewStart={handleInterviewStart}
            getDifficultyColor={getDifficultyColor}
          />
          {/* Sidebar */}
          <DashboardSidebar
            recentInterviews={recentInterviews}
            getScoreColor={getScoreColor}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
}
