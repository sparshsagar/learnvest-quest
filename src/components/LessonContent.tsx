import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonContentProps {
  title: string;
  content: string;
  quiz: Quiz[];
  onComplete: () => void;
}

export const LessonContent = ({ title, content, quiz, onComplete }: LessonContentProps) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("User authenticated:", session.user.id);
        setUserId(session.user.id);
      } else {
        console.log("No authenticated user found");
      }
    };
    checkUser();
  }, []);

  const checkAndAwardBadges = async () => {
    if (!userId) {
      console.log("Cannot award badges: No user ID");
      return;
    }

    try {
      console.log("Checking completed lessons for user:", userId);
      const { data: completedLessons, error: lessonsError } = await supabase
        .from('lessons_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true);

      if (lessonsError) {
        console.error("Error fetching completed lessons:", lessonsError);
        throw lessonsError;
      }

      console.log("Completed lessons count:", completedLessons?.length);

      const { data: totalLessons, error: totalError } = await supabase
        .from('lessons')
        .select('id');

      if (totalError) {
        console.error("Error fetching total lessons:", totalError);
        throw totalError;
      }

      const completedCount = completedLessons?.length || 0;
      console.log("Total lessons count:", totalLessons?.length);

      if (completedCount === 1) {
        console.log("Attempting to award First Step badge");
        await awardBadge('First Step');
      }

      if (completedCount === 3) {
        console.log("Attempting to award Quick Learner badge");
        await awardBadge('Quick Learner');
      }

      if (completedCount === totalLessons?.length) {
        console.log("Attempting to award Investment Master badge");
        await awardBadge('Investment Master');
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const awardBadge = async (badgeName: string) => {
    if (!userId) {
      console.log("Cannot award badge: No user ID");
      return;
    }

    try {
      console.log("Looking up badge:", badgeName);
      const { data: badge, error: badgeError } = await supabase
        .from('badges')
        .select('id')
        .eq('name', badgeName)
        .single();

      if (badgeError) {
        console.error("Error fetching badge:", badgeError);
        throw badgeError;
      }

      console.log("Checking if user already has badge:", badgeName);
      const { data: existingBadge, error: existingError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single();

      if (existingError && existingError.code !== 'PGRST116') throw existingError;
      if (existingBadge) {
        console.log("User already has badge:", badgeName);
        return;
      }

      console.log("Awarding new badge:", badgeName);
      const { error: awardError } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badge.id
        });

      if (awardError) {
        console.error("Error awarding badge:", awardError);
        throw awardError;
      }

      toast.success(`Congratulations! You've earned the ${badgeName} badge!`);
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    const currentQuiz = quiz[currentQuizIndex];
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

    if (isCorrect) {
      if (currentQuizIndex === quiz.length - 1) {
        setQuizCompleted(true);
        onComplete();
        checkAndAwardBadges();
        toast.success("Congratulations! You've completed the lesson!");
      } else {
        toast.success("Correct answer!");
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedAnswer(null);
      }
    } else {
      toast.error("Incorrect answer. Try again!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Lesson Content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {!quizCompleted && quiz.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
            <CardDescription>
              Question {currentQuizIndex + 1} of {quiz.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="font-medium">{quiz[currentQuizIndex].question}</p>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              >
                {quiz[currentQuizIndex].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={handleSubmitAnswer} className="w-full">
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {quizCompleted && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="font-medium">Lesson Completed!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};