"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getCompanyIntro from "@/lib/getCompanyIntro";
import { useCompany } from "@/lib/CompanyContext";
import { UserDetailsContext } from "@/lib/UserContext";

export default function LobbyPage() {
  const { company } = useCompany();
  const { userDetail } = useContext(UserDetailsContext);
  const [loading, setLoading] = useState(false);
  const [introLoading, setIntroLoading] = useState(true);
  const [intro, setIntro] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!company) {
      router.replace("/");
      return;
    }

    const fetchIntro = async () => {
      setIntroLoading(true);
      try {
        const response = await getCompanyIntro(company.toLowerCase());
        setIntro(response);
      } catch (error) {
        setIntro("Failed to load introduction. Please try again later.");
      } finally {
        setIntroLoading(false);
      }
    };

    fetchIntro();
  }, [company]);

  const handleStart = async () => {
    if (loading || !userDetail || userDetail.credits < 1) return;

    setLoading(true);
    try {
      const res = await fetch("/api/voice-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company }),
      });

      if (!res.ok) throw new Error("Failed to create interview session");

      const data = await res.json();
      if (data.sessionId) {
        router.push(`/voice/${data.sessionId}`);
      } else {
        throw new Error("Invalid session response");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasSufficientCredits = userDetail?.credits > 0;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Welcome to {company} Interview</h2>

      <div className="bg-gray-100 p-4 rounded shadow mb-6 max-w-xl text-center text-sm text-gray-700 min-h-[80px] flex items-center justify-center">
        {introLoading ? (
          <span className="text-gray-500 animate-pulse">
            Loading introduction...
          </span>
        ) : (
          intro
        )}
      </div>

      {hasSufficientCredits ? (
        <button
          onClick={handleStart}
          className={`px-6 py-2 rounded text-white flex items-center justify-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
          disabled={loading && introLoading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Starting...
            </div>
          ) : (
            "Start Interview"
          )}
        </button>
      ) : (
        <>
          <p className="text-sm mt-3 text-red-500">
            You don't have credits to start the interview.
          </p>
          <button
            className="px-6 py-2 mt-2 rounded text-white bg-green-700 hover:bg-green-800"
            onClick={() => router.push("/pricing")}
          >
            Upgrade Now
          </button>
        </>
      )}
    </div>
  );
}
