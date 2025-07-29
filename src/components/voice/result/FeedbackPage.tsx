import React from "react";

interface FeedbackPageProps {
  data: any;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ data }) => {
  const { feedback, summary, recommendation, recommendationMsg } = data.answers;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-600">Interview Report</h1>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Ratings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object?.entries(feedback?.rating).map(([category, score]) => (
              <div
                key={category}
                className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg"
              >
                <span className="capitalize font-medium text-gray-600">
                  {category.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-indigo-700 font-bold text-lg">
                  {score as number}/10
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Summary</h2>
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Recommendation
          </h2>
          <div
            className={`p-4 rounded-lg font-semibold text-white ${
              recommendation === "Yes" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {recommendation === "Yes"
              ? "Recommended for Hire ✅"
              : "Not Recommended ❌"}
          </div>
          <p className="mt-2 text-gray-700">{recommendationMsg}</p>
        </section>
      </div>
    </div>
  );
};

export default FeedbackPage;
