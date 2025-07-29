import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import CourseCard from "@/components/course-card";
import TodoList from "@/components/todo-list";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Course, Task, User } from "@shared/schema";

export default function Dashboard() {
  const isMobile = useIsMobile();

  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  if (coursesLoading || tasksLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        {!isMobile && (
          <div className="w-64 lg:w-64 md:w-16 border-r border-gray-200">
            <Skeleton className="h-full" />
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <Skeleton className="h-16" />
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar currentUser={user} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={user} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Course Grid Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold canvas-dark">My Courses</h2>
                <Button variant="link" className="text-canvas-blue hover:text-blue-700 font-medium p-0">
                  View All Courses 
                  <ArrowRight className="ml-1" size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
            
            {/* To-Do List Section */}
            <section>
              {tasks && <TodoList tasks={tasks} />}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
