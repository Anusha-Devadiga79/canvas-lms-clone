import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  currentUser?: {
    displayName: string;
    role: string;
  };
}

export default function Header({ currentUser }: HeaderProps) {
  const isMobile = useIsMobile();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {isMobile && <Sidebar currentUser={currentUser} />}
          <div>
            <h1 className="text-xl font-semibold canvas-dark">
              Welcome back, {currentUser?.displayName?.split(' ')[0] || "John"}!
            </h1>
            <p className="text-sm canvas-gray">
              Today is {today}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
            <Settings size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
