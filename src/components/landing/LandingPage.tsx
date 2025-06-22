"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import CompanyGrid from "@/components/landing/CompanyGrid";
import StartInterviewButton from "@/components/landing/StartInterview";

export default function LandingPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const { isSignedIn } = useUser();
  const isSignedInSafe = !!isSignedIn;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-center">
        AI Mock Interview Platform
      </h1>
      <p className="text-sm text-gray-600 mb-8 text-center">
        Choose a MAANG company and start your interview prep.
      </p>
      <CompanyGrid selected={selectedCompany} onSelect={setSelectedCompany} />
      <StartInterviewButton
        selectedCompany={selectedCompany}
        isSignedIn={isSignedInSafe}
      />
    </>
  );
}
