import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserBadges } from "./UserBadges";
import { toast } from "sonner";
import { BookOpen, CheckCircle2 } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  description: string;
  progress?: number;
  completed?: boolean;
  last_accessed?: string;
};

export const Lessons = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkUser();
  }, [navigate]);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons", userId],
    queryFn: async () => {
      const { data: allLessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id, title, description")
        .order('created_at');

      if (lessonsError) throw lessonsError;

      if (userId) {
        const { data: progress, error: progressError } = await supabase
          .from("lessons_progress")
          .select("lesson_id, progress, completed, last_accessed")
          .eq("user_id", userId);

        if (progressError) throw progressError;

        return allLessons.map((lesson: Lesson) => {
          const lessonProgress = progress?.find(p => p.lesson_id === lesson.id);
          return {
            ...lesson,
            progress: lessonProgress?.progress || 0,
            completed: lessonProgress?.completed || false,
            last_accessed: lessonProgress?.last_accessed
          };
        });
      }

      return allLessons.map((lesson: Lesson) => ({
        ...lesson,
        progress: 0,
        completed: false
      }));
    },
    enabled: !!userId
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, progress, completed }: { lessonId: string; progress: number; completed: boolean }) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("lessons_progress")
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          progress,
          completed,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", userId] });
      toast.success("Progress updated successfully");
    },
    onError: (error) => {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  });

  const handleProgressUpdate = async (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const newProgress = Math.min(100, (lesson.progress || 0) + 20);
    const completed = newProgress === 100;

    await updateProgressMutation.mutateAsync({
      lessonId,
      progress: newProgress,
      completed
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading lessons...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Investment Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <Card 
                key={lesson.id} 
                className={`hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                  lesson.completed ? 'border-green-500' : ''
                }`}
                onClick={() => handleProgressUpdate(lesson.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {lesson.title}
                    </CardTitle>
                    {lesson.completed && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{lesson.progress || 0}%</span>
                    </div>
                    <Progress value={lesson.progress || 0} className="h-2" />
                    {lesson.last_accessed && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last accessed: {new Date(lesson.last_accessed).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          {userId && <UserBadges userId={userId} />}
        </div>
      </div>
    </div>
  );
};