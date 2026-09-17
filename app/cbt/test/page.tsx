"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  id: number;
  course_id: number;
  question_number: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

type Answer = {
  question_id: number;
  answer: string;
};

const BACKEND_URL =
  "https://learning-made-easy-backend.vercel.app";

const TEST_DURATION_SECONDS = 15 * 60s;

function CBTTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [accessCode, setAccessCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const [checkingCode, setCheckingCode] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(
    TEST_DURATION_SECONDS
  );

  useEffect(() => {
    if (!courseId) {
      router.replace("/cbt");
      return;
    }

    const testCourseId = courseId;

    async function initializeTest() {
      try {
        setLoading(true);
        setError("");

        const savedCode =
          sessionStorage.getItem("cbtAccessCode");

        if (savedCode) {
          const verified = await verifyAccessCode(
            savedCode,
            testCourseId
          );

          if (verified) {
            setAccessCode(savedCode);
            setAccessGranted(true);
            await loadQuestions(
              savedCode,
              testCourseId
            );
            return;
          }

          sessionStorage.removeItem("cbtAccessCode");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to initialize the CBT. Please try again."
        );
        setLoading(false);
      }
    }

    initializeTest();
  }, [courseId, router]);

  async function verifyAccessCode(
    code: string,
    selectedCourseId: string
  ) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/cbt/access/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_code: code.trim().toUpperCase(),
            course: selectedCourseId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function loadQuestions(
    code: string,
    selectedCourseId: string
  ) {
    const response = await fetch(
      `${BACKEND_URL}/api/cbt/questions/${selectedCourseId}?limit=50`,
      {
        headers: {
          "x-cbt-access-code": code,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load questions"
      );
    }

    setQuestions(data.questions || []);
  }

  async function handleAccessCodeSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanedCode = codeInput.trim().toUpperCase();

    if (!cleanedCode) {
      setError("Please enter your CBT access code.");
      return;
    }

    if (!courseId) {
      setError("Invalid course.");
      return;
    }

    try {
      setCheckingCode(true);
      setError("");

      const verified = await verifyAccessCode(
        cleanedCode,
        courseId
      );

      if (!verified) {
        setError(
          "Invalid or inactive access code. Please check your code and try again."
        );
        return;
      }

      sessionStorage.setItem(
        "cbtAccessCode",
        cleanedCode
      );

      setAccessCode(cleanedCode);
      setAccessGranted(true);
      setLoading(true);

      await loadQuestions(cleanedCode, courseId);

      // Start a fresh 30-minute test session.
      setTimeLeft(TEST_DURATION_SECONDS);
      sessionStorage.setItem(
        "cbtStartTime",
        Date.now().toString()
      );
    } catch (err) {
      console.error(err);

      sessionStorage.removeItem("cbtAccessCode");
      setAccessCode("");
      setAccessGranted(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the CBT. Please try again."
      );
    } finally {
      setCheckingCode(false);
      setLoading(false);
    }
  }

  /*
   * Restore the timer from the browser session.
   * This prevents the timer from restarting when the
   * page component re-renders.
   */
  useEffect(() => {
    if (!accessGranted || questions.length === 0) {
      return;
    }

    const savedStartTime =
      sessionStorage.getItem("cbtStartTime");

    if (savedStartTime) {
      const elapsedSeconds = Math.floor(
        (Date.now() - Number(savedStartTime)) / 1000
      );

      const remaining = Math.max(
        TEST_DURATION_SECONDS - elapsedSeconds,
        0
      );

      setTimeLeft(remaining);
    }

    const timer = window.setInterval(() => {
      const startTime =
        sessionStorage.getItem("cbtStartTime");

      if (!startTime) return;

      const elapsedSeconds = Math.floor(
        (Date.now() - Number(startTime)) / 1000
      );

      const remaining = Math.max(
        TEST_DURATION_SECONDS - elapsedSeconds,
        0
      );

      setTimeLeft(remaining);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [accessGranted, questions.length]);

  /*
   * Automatically submit when time reaches zero.
   */
  useEffect(() => {
    if (
      timeLeft !== 0 ||
      !accessGranted ||
      questions.length === 0 ||
      submitting
    ) {
      return;
    }

    submitTest(true);
  }, [
    timeLeft,
    accessGranted,
    questions.length,
    submitting,
  ]);

  function selectAnswer(answer: string) {
    if (!questions[currentIndex]) return;

    const questionId = questions[currentIndex].id;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  }

  async function submitTest(
    autoSubmit = false
  ) {
    if (
      !courseId ||
      questions.length === 0 ||
      !accessCode
    ) {
      return;
    }

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Are you sure you want to submit your test?"
      );

      if (!confirmed) return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers: Answer[] =
        questions.map((question) => ({
          question_id: question.id,
          answer: answers[question.id] || "",
        }));

      const response = await fetch(
        `${BACKEND_URL}/api/cbt/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_code: accessCode,
            course_id: Number(courseId),
            answers: formattedAnswers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to submit test"
        );
      }

      sessionStorage.removeItem("cbtStartTime");

      sessionStorage.setItem(
        "cbtResult",
        JSON.stringify({
          success: data.success,
          score: data.score,
          total_questions: data.total_questions,
          percentage: data.percentage,
        })
      );

      sessionStorage.setItem(
        "cbtQuestions",
        JSON.stringify(questions)
      );

      sessionStorage.setItem(
        "cbtAnswers",
        JSON.stringify(answers)
      );

      sessionStorage.setItem(
        "cbtReview",
        JSON.stringify(data.review || [])
      );

      router.push(
        `/cbt/result?courseId=${courseId}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * No course selected
   */
  if (!courseId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#6B2638]">
            Course not selected
          </h1>

          <button
            onClick={() => router.push("/cbt")}
            className="mt-6 rounded-xl bg-[#6B2638] px-6 py-3 font-semibold text-white"
          >
            Back to Courses
          </button>
        </div>
      </main>
    );
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#6B2638]/15 border-t-[#6B2638]" />

          <p className="mt-4 text-[#2B2022]/60">
            {accessGranted
              ? "Loading your test..."
              : "Checking your access..."}
          </p>
        </div>
      </main>
    );
  }

  /*
   * ACCESS CODE GATE
   */
  if (!accessGranted) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
        <header className="border-b border-[#6B2638]/10 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-bold text-[#6B2638]">
                CAMPUS LEARNING HUB
              </p>

              <p className="mt-1 text-xs text-[#2B2022]/50">
                CBT Practice
              </p>
            </div>

            <button
              onClick={() => router.push("/cbt")}
              className="text-sm font-medium text-[#2B2022]/60 transition hover:text-[#6B2638]"
            >
              ← Back to Courses
            </button>
          </div>
        </header>

        <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-[#6B2638]/10 bg-white p-8 shadow-sm md:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B2638]/8">
                  <span className="text-xl font-bold text-[#6B2638]">
                    CBT
                  </span>
                </div>

                <h1 className="mt-6 text-2xl font-bold text-[#2B2022]">
                  Enter Your Access Code
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#2B2022]/60">
                  Enter the CBT access code you received after
                  completing your payment.
                </p>
              </div>

              <form
                onSubmit={handleAccessCodeSubmit}
                className="mt-8"
              >
                <label
                  htmlFor="accessCode"
                  className="text-sm font-semibold text-[#2B2022]"
                >
                  CBT Access Code
                </label>

                <input
                  id="accessCode"
                  type="text"
                  value={codeInput}
                  onChange={(event) =>
                    setCodeInput(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="Enter your access code"
                  autoComplete="off"
                  spellCheck={false}
                  className="mt-2 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 font-semibold tracking-wider text-[#2B2022] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#2B2022]/35 focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
                />

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checkingCode}
                  className="mt-5 w-full rounded-xl bg-[#6B2638] px-6 py-3.5 font-semibold text-white transition hover:bg-[#561E2D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkingCode
                    ? "Verifying Access..."
                    : "Continue to CBT"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-[#FAF7F2] p-4">
                <p className="text-xs leading-5 text-[#2B2022]/55">
                  Your access code is verified securely before
                  the test begins.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-[#C89B5D]" />
          </div>
        </section>
      </main>
    );
  }

  /*
   * If access was granted but no questions were returned
   */
  if (error && questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#6B2638]">
            Unable to load test
          </h1>

          <p className="mt-3 text-[#2B2022]/60">
            {error}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem(
                  "cbtAccessCode"
                );
                sessionStorage.removeItem(
                  "cbtStartTime"
                );

                setAccessCode("");
                setAccessGranted(false);
                setQuestions([]);
                setError("");
              }}
              className="rounded-xl bg-[#6B2638] px-6 py-3 font-semibold text-white"
            >
              Re-enter Access Code
            </button>

            <button
              onClick={() => router.push("/cbt")}
              className="rounded-xl border border-[#6B2638]/15 bg-white px-6 py-3 font-semibold text-[#6B2638]"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[currentIndex];

  if (!question) {
    return null;
  }

  const selectedAnswer = answers[question.id] || "";

  const options = [
    {
      key: "A",
      text: question.option_a,
    },
    {
      key: "B",
      text: question.option_b,
    },
    {
      key: "C",
      text: question.option_c,
    },
    {
      key: "D",
      text: question.option_d,
    },
  ];

  const answeredCount = Object.keys(answers).length;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const timerWarning = timeLeft <= 5 * 60;

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
      <header className="border-b border-[#6B2638]/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-bold text-[#6B2638]">
              CAMPUS LEARNING HUB
            </p>

            <p className="mt-1 text-xs text-[#2B2022]/50">
              CBT Practice
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden text-sm font-semibold text-[#6B2638] sm:block">
              {answeredCount} answered
            </p>

            <div
              className={`rounded-xl border px-4 py-2 text-sm font-bold tabular-nums ${
                timerWarning
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-[#C89B5D]/30 bg-[#FAF7F2] text-[#6B2638]"
              }`}
            >
              ⏱ {formattedTime}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#6B2638]">
            Question {currentIndex + 1}
          </p>

          <p className="text-sm text-[#2B2022]/50">
            {currentIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#6B2638]/10">
          <div
            className="h-full rounded-full bg-[#C89B5D] transition-all"
            style={{
              width: `${
                ((currentIndex + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-[#6B2638]/10 bg-white p-7 shadow-sm md:p-10">
          <h1 className="text-xl font-bold leading-relaxed md:text-2xl">
            {question.question}
          </h1>

          <div className="mt-8 space-y-3">
            {options.map((option) => {
              const selected =
                selectedAnswer === option.key;

              return (
                <button
                  key={option.key}
                  onClick={() =>
                    selectAnswer(option.key)
                  }
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#6B2638] bg-[#6B2638]/5"
                      : "border-[#6B2638]/10 bg-white hover:border-[#A65D6F]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                      selected
                        ? "bg-[#6B2638] text-white"
                        : "bg-[#FAF7F2] text-[#6B2638]"
                    }`}
                  >
                    {option.key}
                  </span>

                  <span className="pt-1 font-medium">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="rounded-xl border border-[#6B2638]/15 bg-white px-6 py-3 font-semibold text-[#6B2638] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => submitTest()}
              disabled={submitting}
              className="rounded-xl bg-[#6B2638] px-7 py-3 font-semibold text-white hover:bg-[#561E2D] disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={goNext}
              className="rounded-xl bg-[#6B2638] px-7 py-3 font-semibold text-white hover:bg-[#561E2D]"
            >
              Next
            </button>
          )}
        </div>
      </section>
    </main>
    );
}

export default function CBTTestPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#6B2638]/15 border-t-[#6B2638]" />

            <p className="mt-4 text-[#2B2022]/60">
              Loading CBT...
            </p>
          </div>
        </main>
      }
    >
      <CBTTestPage />
    </Suspense>
  );
}