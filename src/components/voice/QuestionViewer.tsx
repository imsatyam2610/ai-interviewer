import { Card } from "antd";

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
    <Card
      title={`Question ${currentIndex + 1} of ${totalQuestions}`}
      style={{ marginBottom: 20 }}
    >
      <div className="space-y-1">
        <p className="text-lg font-medium text-gray-800">{questionText}</p>
      </div>
    </Card>
  );
};

export default QuestionViewer;
