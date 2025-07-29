import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Course, Assignment, User } from "@shared/schema";

export default function CourseDetail() {
  const [, params] = useRoute("/courses/:id");
  const isMobile = useIsMobile();
  const courseId = params?.id;

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery<Assignment[]>({
    queryKey: ["/api/courses", courseId, "assignments"],
    enabled: !!courseId,
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  if (courseLoading || !course) {
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
            <Skeleton className="h-8 w-96 mb-6" />
            <Skeleton className="h-32 mb-6" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Due Soon</Badge>;
      case "submitted":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Submitted</Badge>;
      case "graded":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Graded</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatDueDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar currentUser={user} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={user} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight size={16} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight size={16} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="canvas-dark font-medium">
                    {course.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Course Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold canvas-dark mb-2">
                      {course.title}
                    </h1>
                    <p className="canvas-gray mb-4">
                      {course.instructor} • {course.term}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={course.progress} className="w-32" />
                        <span className="text-sm canvas-gray">
                          {course.progress}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-canvas-blue hover:bg-blue-600 text-white">
                    <Star className="mr-2" size={16} />
                    Favorite
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Card>
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200">
                  <TabsList className="flex space-x-8 px-6 bg-transparent h-auto">
                    <TabsTrigger 
                      value="overview" 
                      className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-canvas-blue data-[state=active]:text-canvas-blue bg-transparent"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="assignments" 
                      className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-canvas-blue data-[state=active]:text-canvas-blue bg-transparent"
                    >
                      Assignments
                    </TabsTrigger>
                    <TabsTrigger 
                      value="grades" 
                      className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-canvas-blue data-[state=active]:text-canvas-blue bg-transparent"
                    >
                      Grades
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold canvas-dark mb-4">
                        Course Description
                      </h3>
                      <p className="canvas-gray mb-6 leading-relaxed">
                        {course.description}
                      </p>
                      
                      <h3 className="text-lg font-semibold canvas-dark mb-4">
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-canvas-blue pl-4">
                          <p className="font-medium canvas-dark">Assignment 3 Posted</p>
                          <p className="text-sm canvas-gray">Due March 18, 2024</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <p className="font-medium canvas-dark">Quiz 2 Graded</p>
                          <p className="text-sm canvas-gray">Score: 92/100</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold canvas-dark mb-4">
                        Course Info
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium canvas-gray">Credits</p>
                          <p className="canvas-dark">{course.credits}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium canvas-gray">Term</p>
                          <p className="canvas-dark">{course.term}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium canvas-gray">Meeting Times</p>
                          <p className="canvas-dark">{course.meetingTimes}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium canvas-gray">Location</p>
                          <p className="canvas-dark">{course.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assignments" className="p-6">
                  <div className="space-y-4">
                    {assignmentsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-24" />
                        ))}
                      </div>
                    ) : (
                      assignments?.map((assignment) => (
                        <Card key={assignment.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold canvas-dark">
                                  {assignment.title}
                                </h4>
                                <p className="text-sm canvas-gray mt-1">
                                  {assignment.description}
                                </p>
                              </div>
                              {getStatusBadge(assignment.status)}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm canvas-gray">
                                Due: {formatDueDate(assignment.dueDate)}
                              </span>
                              <Button variant="link" className="text-canvas-blue hover:text-blue-700 font-medium text-sm p-0">
                                {assignment.status === "graded" ? "View Feedback" : "View Assignment"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="grades" className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold canvas-dark">
                            Assignment
                          </th>
                          <th className="text-left py-3 px-4 font-semibold canvas-dark">
                            Due Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold canvas-dark">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-semibold canvas-dark">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments?.filter(a => a.status === "graded").map((assignment) => (
                          <tr key={assignment.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 canvas-dark">
                              {assignment.title}
                            </td>
                            <td className="py-3 px-4 canvas-gray">
                              {formatDueDate(assignment.dueDate)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Graded
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-semibold canvas-success">
                              {assignment.grade}/{assignment.maxGrade}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
