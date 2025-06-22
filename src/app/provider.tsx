"use client";
import Navbar from "@/components/landing/Navbar";
import { CompanyProvider } from "@/lib/CompanyContext";
import { UserDetailsContext } from "@/lib/UserContext";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

export type UsersDetails = {
  name: string;
  email: string;
  credits: number;
};

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to create interview session");

    const data = await res.json();
    setUserDetail(data);
  };
  return (
    <UserDetailsContext.Provider value={{ userDetail, setUserDetail }}>
      <CompanyProvider>
        <Navbar />
        {children}
      </CompanyProvider>
    </UserDetailsContext.Provider>
  );
}

export default Provider;
