import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

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