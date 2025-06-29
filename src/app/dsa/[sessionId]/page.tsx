"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import DSAPage from "@/components/dsa/DSAPage";

export default function Page() {
  const { sessionId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionDetails() {
      const res = await fetch(`/api/dsa-interview?sessionId=${sessionId}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) return <div>Loading interview...</div>;
  if (!data) return notFound();

  return <DSAPage data={data} />;
}
