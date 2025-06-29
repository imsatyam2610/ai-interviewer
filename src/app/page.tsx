import LandingPage from "@/components/landing/LandingPage";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <LandingPage />
      </main>
    </>
  );
}
