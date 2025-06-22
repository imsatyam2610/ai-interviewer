"use client";

import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { useCompany } from "@/lib/CompanyContext";

export default function StartInterviewButton({
  selectedCompany,
  isSignedIn,
}: {
  selectedCompany: string | null;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const { setCompany } = useCompany();
  const handleStart = () => {
    if (isSignedIn && selectedCompany) {
      setCompany(selectedCompany);
      router.push(`/lobby`);
    }
  };

  if (!selectedCompany) {
    return (
      <button
        disabled
        className="bg-gray-300 text-white px-6 py-2 rounded cursor-not-allowed"
      >
        Select a Company to Start
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Sign in to Start Interview
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={handleStart}
      className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-700 transition"
    >
      Start Free Interview
    </button>
  );
}
