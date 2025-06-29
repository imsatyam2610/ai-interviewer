import DashboardHeader from "@/components/dashboard/Header";
import InterviewHistoryPage from "@/components/dashboard/interview/InterviewHistory";
import React from "react";

export default function page() {
  return (
    <>
      <DashboardHeader />
      <InterviewHistoryPage />
    </>
  );
}
