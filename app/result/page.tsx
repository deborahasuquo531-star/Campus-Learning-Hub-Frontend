"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

type Result = {
  success: boolean;
  score: number;
  total_questions: number;
  percentage: number;
};

export default function CBTResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");

  const [result, setResult] = useState<Result | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem("cbtResult");
      const savedQuestions = sessionStorage.getItem("cbtQuestions");
      const savedAnswers = sessionStorage.getItem("cbtAnswers");

      if (!savedResult || !savedQuestions) {
        router.replace("/cbt");
        return;
      }

      setResult(JSON.parse(savedResult));
      setQuestions(JSON.parse(savedQuestions));

      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (error) {
      console.error("Could not load CBT result:", error);
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

  const percentage = Number(result.percentage || 0);

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
      router.push(`/cbt/test?courseId=${courseId}`);
    } else {
      router.push("/cbt");
    }
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
                width: `${Math.min(percentage, 100)}%`,
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
            onClick={() => setShowReview(!showReview)}
            className="rounded-xl border border-[#6B2638]/15 bg-white px-7 py-3 font-semibold text-[#6B2638]"
          >
            {showReview ? "Hide Review" : "Review Answers"}
          </button>
        </div>

        {showReview && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">
              Answer Review
            </h2>

            <p className="mt-2 text-sm text-[#2B2022]/55">
              Your selected answers are shown below.
            </p>

            <div className="mt-6 space-y-5">
              {questions.map((question, index) => {
                const selected =
                  answers[question.id] || "Not answered";

                const optionText: Record<string, string> = {
                  A: question.option_a,
                  B: question.option_b,
                  C: question.option_c,
                  D: question.option_d,
                };

                return (
                  <div
                    key={question.id}
                    className="rounded-3xl border border-[#6B2638]/10 bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-[#C89B5D]">
                      Question {index + 1}
                    </p>

                    <h3 className="mt-3 font-bold leading-relaxed">
                      {question.question}
                    </h3>

                    <div className="mt-5 rounded-2xl bg-[#FAF7F2] p-4">
                      <p className="text-xs font-semibold uppercase text-[#2B2022]/45">
                        Your answer
                      </p>

                      <p className="mt-2 font-medium">
                        {selected === "Not answered"
                          ? "Not answered"
                          : `${selected}. ${optionText[selected] || ""}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}