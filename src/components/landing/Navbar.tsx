'use client'
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-end py-4 sm:px-6 px-4">
      <UserButton />
    </nav>
  );
}
