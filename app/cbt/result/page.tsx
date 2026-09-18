"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Result = {
  score: number;
  total_questions?: number;
  totalQuestions?: number;
  percentage?: number;
  course_id?: number;
  courseId?: number;
};

type ReviewItem = {
  question: string;
  student_answer?: string;
  student_answer_text?: string;
  correct_answer?: string;
  correct_answer_text?: string;
  explanation?: string;
  is_correct?: boolean;
};

export default function CBTResultPage() {
  const router = useRouter();

  const [result, setResult] = useState<Result | null>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [courseId, setCourseId] = useState<string>("");

  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem("cbtResult");
      const savedReview = sessionStorage.getItem("cbtReview");
      const savedCourseId = sessionStorage.getItem("cbtCourseId");

      if (!savedResult) {
        router.replace("/cbt");
        return;
      }

      const parsedResult = JSON.parse(savedResult);

      setResult(parsedResult);

      if (savedReview) {
        setReview(JSON.parse(savedReview));
      }

      if (savedCourseId) {
        setCourseId(savedCourseId);
      } else if (parsedResult.course_id) {
        setCourseId(String(parsedResult.course_id));
      } else if (parsedResult.courseId) {
        setCourseId(String(parsedResult.courseId));
      }
    } catch (error) {
      console.error("Failed to load CBT result:", error);
      router.replace("/cbt");
    }
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading result...</p>
      </main>
    );
  }

  // The CBT contains 50 questions.
  // Use the value from the backend if available, otherwise fall back to 50.
  const totalQuestions =
    result.total_questions ??
    result.totalQuestions ??
    (review. length > 0 ? review. length : 50);

  const score = Number(result.score ?? 0);

  const percentage =
    result.percentage !== undefined
      ? Number(result.percentage)
      : Math.round((score / totalQuestions) * 100);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* RESULT SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CBT Result
          </h1>

          <p className="text-gray-600 mb-8">
            Your test has been submitted successfully.
          </p>

          {/* SCORE */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">
              TOTAL SCORE
            </p>

            <div className="text-5xl font-bold text-blue-600">
              {score} / {totalQuestions}
            </div>

            <p className="text-xl font-semibold text-gray-700 mt-3">
              {percentage}%
            </p>
          </div>

          {/* PERFORMANCE */}
          <div className="border-t pt-6">
            <p className="text-gray-700">
              You answered{" "}
              <span className="font-bold">{score}</span> out of{" "}
              <span className="font-bold">{totalQuestions}</span>{" "}
              questions correctly.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => {
                sessionStorage.removeItem("cbtAnswers");
                sessionStorage.removeItem("cbtReview");
                sessionStorage.removeItem("cbtResult");
                sessionStorage.removeItem("cbtStartTime");

                const targetCourse = courseId || "1";

                router.push(`/cbt/test?courseId=${targetCourse}`);
              }}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Retake Test
            </button>

            <button
              onClick={() => router.push("/cbt")}
              className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Back to CBT
            </button>
          </div>
        </div>

        {/* ANSWER REVIEW */}
        {review.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Answer Review
            </h2>

            <div className="space-y-6">
              {review.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-5"
                >
                  <p className="font-semibold text-gray-900 mb-4">
                    {index + 1}. {item.question}
                  </p>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">
                        Your answer:
                      </span>{" "}
                      {item.student_answer_text ||
                        item.student_answer ||
                        "Not answered"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Correct answer:
                      </span>{" "}
                      {item.correct_answer_text ||
                        item.correct_answer ||
                        "Not available"}
                    </p>

                    {item.explanation && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-4">
                        <p className="font-semibold mb-1">
                          Explanation:
                        </p>
                        <p className="text-gray-700">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}