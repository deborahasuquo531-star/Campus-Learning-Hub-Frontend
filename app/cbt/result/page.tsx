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
  const [courseName, setCourseName] = useState<string>("");

  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem("cbtResult");
      const savedReview = sessionStorage.getItem("cbtReview");
      const savedCourseId = sessionStorage.getItem("cbtCourseId");
      const savedCourse = sessionStorage.getItem("cbtCourse");

      if (!savedResult) {
        router.replace("/cbt");
        return;
      }

      const parsedResult = JSON.parse(savedResult);

      setResult(parsedResult);

      if (savedReview) {
        try {
          const parsedReview = JSON.parse(savedReview);

          if (Array.isArray(parsedReview)) {
            setReview(parsedReview);
          }
        } catch (error) {
          console.error("Failed to parse CBT review:", error);
        }
      }

      if (savedCourseId) {
        setCourseId(savedCourseId);
      } else if (parsedResult.course_id) {
        setCourseId(String(parsedResult.course_id));
      } else if (parsedResult.courseId) {
        setCourseId(String(parsedResult.courseId));
      }

      if (savedCourse) {
        try {
          const parsedCourse = JSON.parse(savedCourse);

          if (typeof parsedCourse === "string") {
            setCourseName(parsedCourse);
          } else if (parsedCourse?.name) {
            setCourseName(parsedCourse.name);
          } else if (parsedCourse?.title) {
            setCourseName(parsedCourse.title);
          }
        } catch {
          setCourseName(savedCourse);
        }
      }
    } catch (error) {
      console.error("Failed to load CBT result:", error);
      router.replace("/cbt");
    }
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#E8D9D1] border-t-[#6B2638] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-[#6B2638] font-medium">
            Loading your result...
          </p>
        </div>
      </main>
    );
  }

  /*
   * The CBT contains 50 questions.
   * Use the backend value if available.
   * Otherwise use the number of review items.
   * If neither exists, fall back to 50.
   */
  const totalQuestions =
    result.total_questions ??
    result.totalQuestions ??
    (review.length > 0 ? review.length : 50);

  const score = Number(result.score ?? 0);

  const percentage =
    result.percentage !== undefined
      ? Number(result.percentage)
      : totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0;

  const displayCourseName =
    courseName ||
    (courseId === "1"
      ? "GST 112 – The Nigerian Peoples and Culture"
      : courseId === "2"
        ? "GST 202"
        : "CBT Examination");

  const getAnswerDisplay = (
    answerText?: string,
    answer?: string,
    fallback = "Not answered"
  ) => {
    if (answerText && answerText.trim()) {
      return answerText;
    }

    if (answer && answer.trim()) {
      return answer;
    }

    return fallback;
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* RESULT SUMMARY */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E8D9D1] overflow-hidden mb-8">

          {/* Header */}
          <div className="bg-[#6B2638] px-6 md:px-8 py-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 border border-white/20 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              CBT Result
            </h1>

            <p className="text-white/80">
              Your test has been submitted successfully.
            </p>
          </div>

          <div className="p-6 md:p-8">

            {/* COURSE */}
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#A65D6F] mb-2">
                Course
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-[#2B2022]">
                {displayCourseName}
              </h2>

              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E7E4] text-[#6B2638] text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#6B2638]" />
                  Test Completed
                </span>
              </div>
            </div>

            {/* SCORE */}
            <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8D9D1] p-6 md:p-8 text-center">

              <p className="text-xs uppercase tracking-widest font-bold text-[#A65D6F] mb-3">
                Total Score
              </p>

              <div className="text-5xl md:text-6xl font-bold text-[#6B2638]">
                {score} / {totalQuestions}
              </div>

              <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[#C89B5D]/15 text-[#6B2638] font-bold text-lg">
                {percentage}%
              </div>

              <p className="text-[#6D5B5F] mt-5">
                You answered{" "}
                <span className="font-bold text-[#6B2638]">
                  {score}
                </span>{" "}
                out of{" "}
                <span className="font-bold text-[#6B2638]">
                  {totalQuestions}
                </span>{" "}
                questions correctly.
              </p>
            </div>

            {/* PERFORMANCE MESSAGE */}
            <div className="mt-6 rounded-xl border-l-4 border-[#C89B5D] bg-[#FBF5EA] px-5 py-4">
              <p className="text-sm text-[#5B474B]">
                Your result has been recorded. Review the answers below to see
                which questions you got right, the correct answers, and the
                explanations.
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
                className="px-6 py-3 rounded-xl bg-[#6B2638] text-white font-semibold hover:bg-[#571E2D] transition shadow-sm"
              >
                Retake Test
              </button>

              <button
                onClick={() => router.push("/cbt")}
                className="px-6 py-3 rounded-xl border border-[#D9C6C0] bg-white text-[#6B2638] font-semibold hover:bg-[#F8EFEC] transition"
              >
                Back to CBT
              </button>
            </div>
          </div>
        </section>

        {/* ANSWER REVIEW */}
        {review.length > 0 && (
          <section className="bg-white rounded-3xl shadow-sm border border-[#E8D9D1] p-6 md:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">

              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-[#A65D6F] mb-1">
                  Detailed Review
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-[#2B2022]">
                  Answer Review
                </h2>
              </div>

              <div className="px-4 py-2 rounded-full bg-[#F3E7E4] text-[#6B2638] font-semibold text-sm">
                {review.length} Questions
              </div>
            </div>

            <div className="space-y-6">

              {review.map((item, index) => {

                const isCorrect = item.is_correct === true;

                const studentAnswer = getAnswerDisplay(
                  item.student_answer_text,
                  item.student_answer
                );

                const correctAnswer = getAnswerDisplay(
                  item.correct_answer_text,
                  item.correct_answer,
                  "Not available"
                );

                return (
                  <article
                    key={index}
                    className={`rounded-2xl border overflow-hidden ${
                      isCorrect
                        ? "border-[#C9DED2]"
                        : "border-[#E6C9C9]"
                    }`}
                  >

                    {/* QUESTION HEADER */}
                    <div
                      className={`px-5 py-4 ${
                        isCorrect
                          ? "bg-[#F0F7F3]"
                          : "bg-[#FBF0F0]"
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        <div
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            isCorrect
                              ? "bg-[#D8EBDD] text-[#285C3C]"
                              : "bg-[#F0D7D7] text-[#8B3030]"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-[#2B2022] leading-relaxed">
                            {item.question}
                          </p>

                          <div className="mt-2">
                            {isCorrect ? (
                              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#285C3C]">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8B3030]">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Incorrect
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ANSWERS */}
                    <div className="p-5 space-y-4">

                      {/* YOUR ANSWER */}
                      <div className="rounded-xl bg-[#FAF7F2] border border-[#E8D9D1] p-4">
                        <p className="text-xs uppercase tracking-wide font-bold text-[#A65D6F] mb-1">
                          Your Answer
                        </p>

                        <p className="text-[#2B2022] font-medium">
                          {studentAnswer}
                        </p>
                      </div>

                      {/* CORRECT ANSWER */}
                      <div className="rounded-xl bg-[#F5F0E7] border border-[#E4D4B7] p-4">
                        <p className="text-xs uppercase tracking-wide font-bold text-[#8B6935] mb-1">
                          Correct Answer
                        </p>

                        <p className="text-[#2B2022] font-semibold">
                          {correctAnswer}
                        </p>
                      </div>

                      {/* EXPLANATION */}
                      {item.explanation && (
                        <div className="rounded-xl bg-[#F8F0F2] border border-[#E5D0D6] p-4">
                          <p className="text-xs uppercase tracking-wide font-bold text-[#6B2638] mb-2">
                            Explanation
                          </p>

                          <p className="text-[#5B474B] leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      )}

                    </div>
                  </article>
                );
              })}

            </div>
          </section>
        )}

        {/* NO REVIEW FALLBACK */}
        {review.length === 0 && (
          <section className="bg-white rounded-3xl shadow-sm border border-[#E8D9D1] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F3E7E4] flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-[#6B2638]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#2B2022] mb-2">
              Answer Review Unavailable
            </h2>

            <p className="text-[#6D5B5F]">
              Your score was recorded, but detailed answer review is not
              available for this attempt.
            </p>
          </section>
        )}

      </div>
    </main>
  );
}