import NotFoundLayout from "@/components/common/NotFound";

export default function NotFound() {
  const data = {
    title: "Page Not found",
    descriptions:
      "The page you are looking for might have been removed, had its name changed",
    desbr: "or is temporarily unavailable",
  };
  return <NotFoundLayout data={data} />;
}
