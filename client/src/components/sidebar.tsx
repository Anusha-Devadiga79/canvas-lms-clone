import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Inbox, 
  HelpCircle, 
  GraduationCap, 
  User,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  currentUser?: {
    displayName: string;
    role: string;
  };
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/inbox", icon: Inbox, label: "Inbox" },
    { path: "/help", icon: HelpCircle, label: "Help" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-canvas-blue rounded flex items-center justify-center">
            <GraduationCap className="text-white text-sm" size={16} />
          </div>
          <span className="font-semibold text-lg canvas-dark hidden lg:block md:hidden">Canvas</span>
        </div>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-canvas-blue text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="hidden lg:block md:hidden">{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-600 text-sm" size={16} />
          </div>
          <div className="hidden lg:block md:hidden">
            <p className="text-sm font-medium canvas-dark">
              {currentUser?.displayName || "John Student"}
            </p>
            <p className="text-xs canvas-gray">
              {currentUser?.role || "Student"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="sidebar-transition bg-white border-r border-gray-200 flex flex-col w-64 lg:w-64 md:w-16 h-full shadow-sm">
      <SidebarContent />
    </div>
  );
}
