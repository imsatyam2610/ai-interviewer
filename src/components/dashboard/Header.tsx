import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface Props {}

const DashboardHeader: React.FC<Props> = ({}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Interview Platform
            </h1>
            <p className="text-gray-600 mt-1">
              Sharpen your skills with AI-powered mock interviews
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center justify-center">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
