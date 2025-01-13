import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserBadges } from "./UserBadges";

type Lesson = {
  id: string;
  title: string;
  description: string;
  progress?: number;
  completed?: boolean;
};

export const Lessons = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

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
          .select("lesson_id, progress, completed")
          .eq("user_id", userId);

        if (progressError) throw progressError;

        return allLessons.map((lesson: Lesson) => {
          const lessonProgress = progress?.find(p => p.lesson_id === lesson.id);
          return {
            ...lesson,
            progress: lessonProgress?.progress || 0,
            completed: lessonProgress?.completed || false
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
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{lesson.progress || 0}%</span>
                    </div>
                    <Progress value={lesson.progress || 0} className="h-2" />
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