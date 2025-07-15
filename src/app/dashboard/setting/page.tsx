import DashboardHeader from "@/components/dashboard/Header";
import SettingsPage from "@/components/dashboard/setting/Settings";
import React from "react";

export default function page() {
  return (
    <>
      <DashboardHeader />
      <SettingsPage />
    </>
  );
}
