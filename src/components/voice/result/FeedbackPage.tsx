interface FeedbackPageProps {
  data: any;
}
const FeedbackPage: React.FC<FeedbackPageProps> = ({ data }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Interview Results</h1>
      {data.answers.map((entry: any, index: any) => (
        <div key={index} className="mb-4 p-4 border rounded shadow">
          <p>
            <strong>Question ID:</strong> {entry.questionId}
          </p>
          <p>
            <strong>Question:</strong> {entry.questionText}
          </p>
          <p>
            <strong>Answer:</strong> {entry.answer}
          </p>
        </div>
      ))}
    </div>
  );
};
export default FeedbackPage;
