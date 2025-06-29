"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";

interface InterviewSummary {
  id: string;
  type: "Voice Interview" | "DSA Interview";
  score: number;
  date: string;
  duration: string;
}

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/interview/history?page=${currentPage}&limit=5`
      );
      const data = await res.json();
      setInterviews(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(currentPage);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Interview History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : interviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No interviews found.
            </p>
          ) : (
            <div className="space-y-4">
              {interviews.map((i: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-md bg-white shadow-sm hover:bg-gray-50 transition"
                >
                  <div className="space-y-1">
                    <Badge variant="outline">{i.type}</Badge>
                    <p className="font-medium">{i.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(i.date).toLocaleDateString()} •
                      {formatTime(i.duration)}
                    </p>
                  </div>
                  <div
                    className={`font-semibold text-lg ${getScoreColor(
                      i.score
                    )}`}
                  >
                    {i.score}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchHistory(page - 1)}
              disabled={page === 1 || loading}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchHistory(page + 1)}
              disabled={page === totalPages || loading}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
