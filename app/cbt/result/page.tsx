"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReviewItem = {
  question_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  student_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
};

type Result = {
  success: boolean;
  score: number;
  total_questions: number;
  percentage: number;
};

function CBTResultContent() {
  const router = useRouter();

  const [courseId, setCourseId] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<Result | null>(null);

  const [review, setReview] =
    useState<ReviewItem[]>([]);

  const [showReview, setShowReview] =
    useState(false);

  useEffect(() => {
    setCourseId(
      new URLSearchParams(
        window.location.search
      ).get("courseId")
    );

    try {
      const savedResult =
        sessionStorage.getItem("cbtResult");

      const savedReview =
        sessionStorage.getItem("cbtReview");

      if (!savedResult) {
        router.replace("/cbt");
        return;
      }

      setResult(JSON.parse(savedResult));

      if (savedReview) {
        setReview(JSON.parse(savedReview));
      }
    } catch (error) {
      console.error(
        "Could not load CBT result:",
        error
      );

      router.replace("/cbt");
    }
  }, [router]);

  if (!result) {
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

  const percentage = Number(
    result.percentage || 0
  );

  const courseName =
    courseId === "1"
      ? "GST 112 — The Nigerian People and Culture"
      : courseId === "2"
        ? "GST 202 — Philosophy and Logic for Human Existence"
        : "CBT Result";

  const performance =
    percentage >= 70
      ? "Strong Performance"
      : percentage >= 50
        ? "Good Attempt"
        : "Keep Practicing";

  function retakeTest() {
    if (courseId) {
      router.push(
        `/cbt/test?courseId=${courseId}`
      );
    } else {
      router.push("/cbt");
    }
  }

  function getOptionText(
    item: ReviewItem,
    letter: string
  ) {
    const options: Record<string, string> = {
      A: item.option_a,
      B: item.option_b,
      C: item.option_c,
      D: item.option_d,
    };

    return options[letter] || "";
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
      <header className="border-b border-[#6B2638]/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
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

      <section className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-semibold text-[#6B2638]">
            {courseName}
          </span>

          <h1 className="mt-6 text-3xl font-bold md:text-4xl">
            Test Completed
          </h1>

          <p className="mt-3 text-[#2B2022]/60">
            Your answers have been submitted successfully.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-[#6B2638]/10 bg-white p-8 text-center shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C89B5D]">
            Your Score
          </p>

          <div className="mt-4">
            <span className="text-6xl font-bold text-[#6B2638]">
              {result.score}
            </span>

            <span className="ml-2 text-2xl text-[#2B2022]/35">
              / {result.total_questions}
            </span>
          </div>

          <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden rounded-full bg-[#6B2638]/10">
            <div
              className="h-full rounded-full bg-[#C89B5D]"
              style={{
                width: `${Math.min(
                  percentage,
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-4 text-3xl font-bold">
            {percentage}%
          </p>

          <h2 className="mt-6 text-xl font-bold text-[#6B2638]">
            {performance}
          </h2>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={retakeTest}
            className="rounded-xl bg-[#6B2638] px-7 py-3 font-semibold text-white hover:bg-[#561E2D]"
          >
            Retake Test
          </button>

          <button
            onClick={() =>
              setShowReview(!showReview)
            }
            className="rounded-xl border border-[#6B2638]/15 bg-white px-7 py-3 font-semibold text-[#6B2638]"
          >
            {showReview
              ? "Hide Review"
              : "Review Answers"}
          </button>
        </div>

        {showReview && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">
              Answer Review
            </h2>

            <p className="mt-2 text-sm text-[#2B2022]/55">
              Review your answers, the correct answers,
              and the explanations.
            </p>

            {review.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[#6B2638]/10 bg-white p-6">
                <p className="text-[#2B2022]/60">
                  Review information is not available
                  for this attempt.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {review.map((item, index) => {
                  const studentAnswer =
                    item.student_answer;

                  const correctAnswer =
                    item.correct_answer;

                  return (
                    <div
                      key={item.question_id}
                      className="rounded-3xl border border-[#6B2638]/10 bg-white p-6 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-[#C89B5D]">
                        Question {index + 1}
                      </p>

                      <h3 className="mt-3 font-bold leading-relaxed">
                        {item.question}
                      </h3>

                      <div
                        className={`mt-5 rounded-2xl p-4 ${
                          item.is_correct
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2B2022]/45">
                          Your answer
                        </p>

                        <p className="mt-2 font-semibold">
                          {studentAnswer
                            ? `${studentAnswer}. ${getOptionText(
                                item,
                                studentAnswer
                              )}`
                            : "Not answered"}
                        </p>

                        <p
                          className={`mt-2 text-sm font-semibold ${
                            item.is_correct
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {item.is_correct
                            ? "✓ Correct"
                            : "✗ Incorrect"}
                        </p>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[#FAF7F2] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2B2022]/45">
                          Correct answer
                        </p>

                        <p className="mt-2 font-semibold text-[#6B2638]">
                          {correctAnswer}.{" "}
                          {getOptionText(
                            item,
                            correctAnswer
                          )}
                        </p>
                      </div>

                      {item.explanation && (
                        <div className="mt-4 rounded-2xl border border-[#C89B5D]/25 bg-[#C89B5D]/5 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#C89B5D]">
                            Explanation
                          </p>

                          <p className="mt-2 leading-relaxed text-[#2B2022]/75">
                            {item.explanation}
                          </p>
                        </div>
                      )}
                    </div>
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