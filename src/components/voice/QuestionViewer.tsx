import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  questionText: string;
  currentIndex: number;
  totalQuestions: number;
}

const QuestionViewer: React.FC<Props> = ({
  questionText,
  currentIndex,
  totalQuestions,
}) => {
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>{`Question ${
          currentIndex + 1
        } of ${totalQuestions}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium text-gray-800">{questionText}</p>
      </CardContent>
    </Card>
  );
};

export default QuestionViewer;
