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
  correct_answer: string;
  explanation: string;
};

type Answer = {
  question_id: number;
  answer: string;
};

const BACKEND_URL =
  "https://learning-made-easy-backend.vercel.app";

const TEST_DURATION_SECONDS = 15 * 60;

function CBTTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");

  const [accessCode, setAccessCode] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [accessVerified, setAccessVerified] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(
    TEST_DURATION_SECONDS
  );

  const [submitting, setSubmitting] = useState(false);

  /*
   * GET ACCESS CODE AND COURSE
   */
  useEffect(() => {
    const storedAccessCode =
      sessionStorage.getItem("cbtAccessCode");

    if (!storedAccessCode || !courseId) {
      router.replace("/cbt");
      return;
    }

    setAccessCode(storedAccessCode);
    setSelectedCourseId(courseId);
    setLoading(false);
  }, [courseId, router]);

  /*
   * VERIFY CBT ACCESS
   */
  useEffect(() => {
    if (!accessCode || !selectedCourseId) return;

    const verifyAccess = async () => {
      try {
        setError("");

        const response = await fetch(
          `${BACKEND_URL}/api/cbt/access/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_code: accessCode,
              course: selectedCourseId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "CBT access verification failed."
          );
        }

        setAccessVerified(true);
      } catch (err) {
        console.error(
          "CBT access verification failed:",
          err
        );

        sessionStorage.removeItem("cbtAccessCode");

        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify CBT access."
        );

        setTimeout(() => {
          router.replace("/cbt");
        }, 2000);
      }
    };

    verifyAccess();
  }, [accessCode, selectedCourseId, router]);

  /*
   * LOAD QUESTIONS
   */
  useEffect(() => {
    if (!accessVerified || !selectedCourseId) return;

    const loadQuestions = async () => {
      try {
        setLoadingQuestions(true);
        setError("");

        const response = await fetch(
          `${BACKEND_URL}/api/cbt/questions/${selectedCourseId}?limit=50`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-cbt-access-code": accessCode,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load CBT questions."
          );
        }

        const loadedQuestions: Question[] =
          data.questions || [];

        if (loadedQuestions.length === 0) {
          throw new Error(
            "No CBT questions are available for this course."
          );
        }

        setQuestions(loadedQuestions);

        const initialAnswers: Answer[] =
          loadedQuestions.map((question) => ({
            question_id: question.id,
            answer: "",
          }));

        setAnswers(initialAnswers);

        /*
         * TIMER
         *
         * Continue existing test after refresh.
         */
        const existingStartTime =
          sessionStorage.getItem("cbtStartTime");

        if (existingStartTime) {
          const elapsed = Math.floor(
            (Date.now() -
              Number(existingStartTime)) /
              1000
          );

          const remaining =
            TEST_DURATION_SECONDS - elapsed;

          setTimeLeft(Math.max(remaining, 0));
        } else {
          sessionStorage.setItem(
            "cbtStartTime",
            Date.now().toString()
          );

          setTimeLeft(TEST_DURATION_SECONDS);
        }
      } catch (err) {
        console.error(
          "Unable to load CBT questions:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load CBT questions."
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [
    accessVerified,
    selectedCourseId,
    accessCode,
  ]);

  /*
   * COUNTDOWN TIMER
   */
  useEffect(() => {
    if (
      !accessVerified ||
      questions.length === 0 ||
      submitting
    ) {
      return;
    }

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [
    accessVerified,
    questions.length,
    submitting,
    timeLeft,
  ]);

  /*
   * AUTOMATIC SUBMISSION
   */
  useEffect(() => {
    if (
      timeLeft === 0 &&
      questions.length > 0 &&
      accessVerified &&
      !submitting
    ) {
      handleSubmit();
    }
  }, [
    timeLeft,
    questions.length,
    accessVerified,
    submitting,
  ]);

  /*
   * FORMAT TIMER
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * SELECT ANSWER
   */
  const handleAnswer = (answer: string) => {
    if (!questions[currentQuestion]) return;

    const questionId =
      questions[currentQuestion].id;

    setAnswers((previous) =>
      previous.map((item) =>
        item.question_id === questionId
          ? {
              ...item,
              answer,
            }
          : item
      )
    );
  };

  /*
   * GET CURRENT ANSWER
   */
  const getCurrentAnswer = () => {
    if (!questions[currentQuestion]) return "";

    const questionId =
      questions[currentQuestion].id;

    return (
      answers.find(
        (item) =>
          item.question_id === questionId
      )?.answer || ""
    );
  };

  /*
   * SUBMIT CBT
   */
  const handleSubmit = async () => {
    if (submitting) return;

    if (
      !accessCode ||
      !selectedCourseId ||
      questions.length === 0
    ) {
      setError(
        "Unable to submit the CBT. Please try again."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/cbt/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_code: accessCode,
            course_id: Number(selectedCourseId),
            answers: answers.map((item) => ({
              question_id: Number(
                item.question_id
              ),
              answer: item.answer || "",
            })),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "CBT SUBMISSION RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to submit CBT."
        );
      }

      /*
       * SAVE COMPLETE RESULT
       */
      const result = {
        score: data.score ?? 0,
        totalQuestions:
          data.total_questions ??
          questions.length,
        percentage: data.percentage ?? 0,
        courseId: selectedCourseId,
        completedAt:
          new Date().toISOString(),
      };

      sessionStorage.setItem(
        "cbtResult",
        JSON.stringify(result)
      );

      /*
       * SAVE QUESTIONS
       */
      sessionStorage.setItem(
        "cbtQuestions",
        JSON.stringify(questions)
      );

      /*
       * SAVE STUDENT ANSWERS
       */
      sessionStorage.setItem(
        "cbtAnswers",
        JSON.stringify(answers)
      );

      /*
       * SAVE BACKEND REVIEW
       *
       * The backend should return:
       * question
       * student_answer
       * correct_answer
       * is_correct
       * explanation
       */
      sessionStorage.setItem(
        "cbtReview",
        JSON.stringify(data.review || [])
      );

      /*
       * REMOVE TIMER
       */
      sessionStorage.removeItem(
        "cbtStartTime"
      );

      /*
       * GO TO RESULT PAGE
       */
      router.replace(
        `/cbt/result?courseId=${selectedCourseId}`
      );
    } catch (err) {
      console.error(
        "CBT submission failed:",
        err
      );

      setSubmitting(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your CBT. Please try again."
      );
    }
  };

  /*
   * NEXT QUESTION
   */
  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * PREVIOUS QUESTION
   */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#6B2638]/15 border-t-[#6B2638]" />

          <p className="mt-4 text-[#2B2022]/60">
            Loading CBT...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ERROR
   */
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#2B2022]">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#2B2022]/60">
            {error}
          </p>

          <button
            onClick={() =>
              router.replace("/cbt")
            }
            className="mt-6 rounded-xl bg-[#6B2638] px-6 py-3 font-semibold text-white transition hover:bg-[#571f2e]"
          >
            Back to CBT
          </button>
        </div>
      </main>
    );
  }

  /*
   * PREPARING CBT
   */
  if (
    !accessVerified ||
    loadingQuestions ||
    questions.length === 0
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#6B2638]/15 border-t-[#6B2638]" />

          <p className="mt-4 text-[#2B2022]/60">
            Preparing your CBT...
          </p>
        </div>
      </main>
    );
  }

  const question =
    questions[currentQuestion];

  const currentAnswer =
    getCurrentAnswer();

  const answeredCount =
    answers.filter(
      (answer) => answer.answer !== ""
    ).length;

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  const isLastQuestion =
    currentQuestion ===
    questions.length - 1;

  const timerWarning =
    timeLeft <= 5 * 60;

  const options = [
    {
      letter: "A",
      value: question.option_a,
    },
    {
      letter: "B",
      value: question.option_b,
    },
    {
      letter: "C",
      value: question.option_c,
    },
    {
      letter: "D",
      value: question.option_d,
    },
  ];

  /*
   * CBT INTERFACE
   */
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <header className="sticky top-0 z-20 border-b border-[#2B2022]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A65D6F]">
                CAMPUS LEARNING HUB
              </p>

              <h1 className="mt-1 text-lg font-bold text-[#2B2022] sm:text-xl">
                CBT Examination
              </h1>
            </div>

            <div
              className={`rounded-xl border px-4 py-2 text-center ${
                timerWarning
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-[#C89B5D]/30 bg-[#C89B5D]/10 text-[#6B2638]"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider">
                Time Left
              </p>

              <p className="text-lg font-bold tabular-nums">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#6B2638]/10">
            <div
              className="h-full rounded-full bg-[#6B2638] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#6B2638]">
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </p>

            <p className="mt-1 text-xs text-[#2B2022]/50">
              {answeredCount} answered
            </p>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2B2022]/60 shadow-sm">
            {Math.round(progress)}% Complete
          </div>
        </div>

        <section className="rounded-2xl border border-[#2B2022]/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#A65D6F]">
              Question {question.question_number}
            </p>

            <h2 className="text-lg font-semibold leading-8 text-[#2B2022] sm:text-xl">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {options.map((option) => {
              const selected =
                currentAnswer === option.value;

              return (
                <button
                  key={option.letter}
                  type="button"
                  onClick={() =>
                    handleAnswer(option.value)
                  }
                  disabled={submitting}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-[#6B2638] bg-[#6B2638]/5 ring-2 ring-[#6B2638]/10"
                      : "border-[#2B2022]/10 bg-white hover:border-[#A65D6F]/40 hover:bg-[#FAF7F2]"
                  } ${
                    submitting
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      selected
                        ? "bg-[#6B2638] text-white"
                        : "bg-[#FAF7F2] text-[#6B2638]"
                    }`}
                  >
                    {option.letter}
                  </span>

                  <span
                    className={`pt-1 text-sm leading-6 sm:text-base ${
                      selected
                        ? "font-semibold text-[#2B2022]"
                        : "text-[#2B2022]/80"
                    }`}
                  >
                    {option.value}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={
              currentQuestion === 0 ||
              submitting
            }
            className="rounded-xl border border-[#2B2022]/10 bg-white px-6 py-3 font-semibold text-[#2B2022] transition hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="rounded-xl bg-[#6B2638] px-7 py-3 font-semibold text-white transition hover:bg-[#571f2e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-[#C89B5D] px-7 py-3 font-bold text-[#2B2022] transition hover:bg-[#b88b4f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#2B2022]/45">
            Your test will be submitted
            automatically when the timer reaches
            zero.
          </p>
        </div>
      </div>
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
      <CBTTestContent />
    </Suspense>
  );
}