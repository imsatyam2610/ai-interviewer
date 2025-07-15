import { Download, Home, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  mockProblem: string;
  handleDownload: () => void;
}

const DSAResultHeader: React.FC<Props> = ({ mockProblem, handleDownload }) => {
  const handleShare = () => {
    const shareText = `Hey! Check out my DSA Interview Result: ${window.location.href}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappURL, "_blank");
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex max-sm:flex-col gap-3 justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Interview Results
            </h1>
            <p className="text-gray-600 mt-1">DSA Challenge - {mockProblem}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share <span className="max-sm:hidden">Results</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              <span className="max-sm:hidden">Download</span> Report
            </Button>
            <Link href="/">
              <Button size="sm">
                <Home className="w-4 h-4 sm:mr-2" />
                <span className="max-sm:hidden">Back to Lobby</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAResultHeader;
