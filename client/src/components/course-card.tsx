import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="course-card">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg canvas-dark mb-1">
            {course.title}
          </h3>
          <p className="text-sm canvas-gray mb-2">
            {course.instructor}
          </p>
          <div className="flex items-center space-x-2">
            <Progress value={course.progress} className="flex-1" />
            <span className="text-xs canvas-gray">{course.progress}%</span>
          </div>
        </div>
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full bg-canvas-blue hover:bg-blue-600 text-white">
            Go to Course
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
