"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReviewItem = {
  question_id: number;
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  student_answer?: string | null;
  correct_answer?: string | null;
  is_correct?: boolean;
  explanation?: string | null;
};

type Result = {
  score: number;
  totalQuestions: number;
  percentage: number;
  courseId: string;
  completedAt?: string;
};

function CBTResultContent() {
  const router = useRouter();

  const [courseId, setCourseId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [showReview, setShowReview] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(
        window.location.search
      );

      const urlCourseId = params.get("courseId");

      setCourseId(urlCourseId);

      const savedResult =
        sessionStorage.getItem("cbtResult");

      const savedReview =
        sessionStorage.getItem("cbtReview");

      if (!savedResult) {
        router.replace("/cbt");
        return;
      }

      const parsedResult = JSON.parse(savedResult);

      const normalizedResult: Result = {
        score: Number(parsedResult.score ?? 0),

        totalQuestions: Number(
          parsedResult.totalQuestions ??
            parsedResult.total_questions ??
            0
        ),

        percentage: Number(
          parsedResult.percentage ?? 0
        ),

        courseId:
          parsedResult.courseId ??
          urlCourseId ??
          "",

        completedAt:
          parsedResult.completedAt,
      };

      setResult(normalizedResult);

      if (savedReview) {
        const parsedReview = JSON.parse(
          savedReview
        );

        if (Array.isArray(parsedReview)) {
          setReview(parsedReview);
        }
      }
    } catch (error) {
      console.error(
        "Could not load CBT result:",
        error
      );

      router.replace("/cbt");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading || !result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#6B2638]/15 border-t-[#6B2638]" />

          <p className="mt-4 text-[#2B2022]/60">
            Loading your result...
          </p>
        </div>
      </main>
    );
  }

  const percentage = Math.max(
    0,
    Math.min(100, Number(result.percentage || 0))
  );

  const courseName =
    courseId === "1"
      ? "GST 112 — The Nigerian People and Culture"
      : courseId === "2"
        ? "GST 202 — Philosophy and Logic for Human Existence"
        : "CBT Examination";

  const correctCount = review.filter(
    (item) => item.is_correct === true
  ).length;

  const incorrectCount = review.filter(
    (item) => item.is_correct === false
  ).length;

  const unansweredCount = review.filter(
    (item) =>
      !item.student_answer ||
      item.student_answer.trim() === ""
  ).length;

  const getOptionText = (
    item: ReviewItem,
    answer: string | null | undefined
  ) => {
    if (!answer) return "";

    const normalized = answer
      .toString()
      .trim()
      .toUpperCase();

    const options: Record<string, string> = {
      A: item.option_a || "",
      B: item.option_b || "",
      C: item.option_c || "",
      D: item.option_d || "",
    };

    return options[normalized] || "";
  };

  const formatAnswer = (
    item: ReviewItem,
    answer: string | null | undefined
  ) => {
    if (!answer || answer.trim() === "") {
      return "Not answered";
    }

    const text = answer.trim();

    const optionText = getOptionText(
      item,
      text
    );

    if (optionText) {
      return `${text.toUpperCase()}. ${optionText}`;
    }

    return text;
  };

  const performance =
    percentage >= 70
      ? "Strong Performance"
      : percentage >= 50
        ? "Good Attempt"
        : "Keep Practicing";

  const retakeTest = () => {
    if (courseId) {
      sessionStorage.removeItem(
        "cbtResult"
      );

      sessionStorage.removeItem(
        "cbtReview"
      );

      sessionStorage.removeItem(
        "cbtQuestions"
      );

      sessionStorage.removeItem(
        "cbtAnswers"
      );

      sessionStorage.removeItem(
        "cbtStartTime"
      );

      router.push(
        `/cbt/test?courseId=${courseId}`
      );
    } else {
      router.push("/cbt");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
      <header className="border-b border-[#6B2638]/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-sm font-bold text-[#6B2638]">
              CAMPUS LEARNING HUB
            </p>

            <p className="mt-1 text-xs text-[#2B2022]/50">
              CBT Result
            </p>
          </div>

          <button
            onClick={() => router.push("/cbt")}
            className="text-sm font-semibold text-[#6B2638]"
          >
            Back to Courses
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        {/* RESULT HEADER */}
        <div className="text-center">
          <span className="inline-flex max-w-full rounded-full bg-[#6B2638]/8 px-4 py-2 text-xs font-semibold text-[#6B2638] sm:text-sm">
            {courseName}
          </span>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            Test Completed
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#2B2022]/60 sm:text-base">
            Your test has been submitted successfully.
            Your score and answer review are shown below.
          </p>
        </div>

        {/* SCORE CARD */}
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-[#6B2638]/10 bg-white p-6 text-center shadow-sm sm:mt-10 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C89B5D]">
            Your Score
          </p>

          <div className="mt-4">
            <span className="text-6xl font-bold text-[#6B2638] sm:text-7xl">
              {result.score}
            </span>

            <span className="ml-2 text-2xl text-[#2B2022]/35">
              / {result.totalQuestions}
            </span>
          </div>

          <div className="mx-auto mt-7 h-3 max-w-md overflow-hidden rounded-full bg-[#6B2638]/10">
            <div
              className="h-full rounded-full bg-[#C89B5D] transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <p className="mt-4 text-3xl font-bold text-[#2B2022]">
            {percentage}%
          </p>

          <h2 className="mt-5 text-xl font-bold text-[#6B2638]">
            {performance}
          </h2>
        </div>

        {/* SUMMARY */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
            <p className="text-2xl font-bold text-green-700">
              {correctCount}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-green-700/70">
              Correct
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-2xl font-bold text-red-700">
              {incorrectCount}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-700/70">
              Incorrect
            </p>
          </div>

          <div className="rounded-2xl border border-[#C89B5D]/20 bg-[#C89B5D]/5 p-5 text-center">
            <p className="text-2xl font-bold text-[#6B2638]">
              {unansweredCount}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#6B2638]/60">
              Unanswered
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={retakeTest}
            className="rounded-xl bg-[#6B2638] px-7 py-3 font-semibold text-white transition hover:bg-[#561E2D]"
          >
            Retake Test
          </button>

          <button
            onClick={() =>
              setShowReview(!showReview)
            }
            className="rounded-xl border border-[#6B2638]/15 bg-white px-7 py-3 font-semibold text-[#6B2638] transition hover:bg-[#FAF7F2]"
          >
            {showReview
              ? "Hide Review"
              : "Review Answers"}
          </button>
        </div>

        {/* ANSWER REVIEW */}
        {showReview && (
          <section className="mx-auto mt-10 max-w-4xl">
            <div>
              <h2 className="text-2xl font-bold">
                Answer Review
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#2B2022]/55">
                Check your answer, the correct answer,
                and the explanation for each question.
              </p>
            </div>

            {review.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[#6B2638]/10 bg-white p-6 text-center shadow-sm">
                <p className="font-semibold text-[#2B2022]">
                  Review information is not available.
                </p>

                <p className="mt-2 text-sm text-[#2B2022]/55">
                  Your score was saved, but the backend
                  did not return the question review.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {review.map((item, index) => {
                  const studentAnswer =
                    item.student_answer;

                  const correctAnswer =
                    item.correct_answer;

                  const isCorrect =
                    item.is_correct === true;

                  return (
                    <article
                      key={`${item.question_id}-${index}`}
                      className="rounded-3xl border border-[#6B2638]/10 bg-white p-5 shadow-sm sm:p-7"
                    >
                      {/* QUESTION NUMBER + STATUS */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[#C89B5D]">
                          Question {index + 1}
                        </p>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isCorrect
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isCorrect
                            ? "✓ Correct"
                            : "✗ Incorrect"}
                        </span>
                      </div>

                      {/* QUESTION */}
                      <h3 className="mt-4 text-base font-bold leading-7 sm:text-lg">
                        {item.question}
                      </h3>

                      {/* YOUR ANSWER */}
                      <div
                        className={`mt-6 rounded-2xl p-4 ${
                          isCorrect
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-[#2B2022]/45">
                          Your Answer
                        </p>

                        <p
                          className={`mt-2 font-semibold ${
                            isCorrect
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {formatAnswer(
                            item,
                            studentAnswer
                          )}
                        </p>
                      </div>

                      {/* CORRECT ANSWER */}
                      <div className="mt-4 rounded-2xl bg-[#FAF7F2] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#2B2022]/45">
                          Correct Answer
                        </p>

                        <p className="mt-2 font-semibold text-[#6B2638]">
                          {formatAnswer(
                            item,
                            correctAnswer
                          )}
                        </p>
                      </div>

                      {/* EXPLANATION */}
                      {item.explanation &&
                        item.explanation.trim() !== "" && (
                          <div className="mt-4 rounded-2xl border border-[#C89B5D]/25 bg-[#C89B5D]/5 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#C89B5D]">
                              Explanation
                            </p>

                            <p className="mt-2 text-sm leading-7 text-[#2B2022]/75">
                              {item.explanation}
                            </p>
                          </div>
                        )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default function CBTResultPage() {
  return <CBTResultContent />;
}