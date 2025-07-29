import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import type { Task } from "@shared/schema";

interface TodoListProps {
  tasks: Task[];
}

export default function TodoList({ tasks }: TodoListProps) {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({ id: taskId, completed });
  };

  const getPriorityBadge = (priority: string, completed: boolean) => {
    if (completed) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
    }
    
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Low Priority</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const formatDueDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold canvas-dark">To-Do List</CardTitle>
          <Button variant="link" className="text-canvas-blue hover:text-blue-700 text-sm font-medium p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => 
                  handleTaskToggle(task.id, checked as boolean)
                }
                className="data-[state=checked]:bg-canvas-blue data-[state=checked]:border-canvas-blue"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium canvas-dark ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.title}
                </p>
                <p className="text-xs canvas-gray">
                  Due: {formatDueDate(task.dueDate)}
                </p>
              </div>
              {getPriorityBadge(task.priority, task.completed)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
