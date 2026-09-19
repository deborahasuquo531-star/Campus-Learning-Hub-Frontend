"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type Question = {
  id: number;
  course_id: number;
  question_number: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: string;
  explanation?: string;
};

type Answer = {
  question_id: number;
  answer: string;
};

type ShuffledOption = {
  displayLetter: string;
  originalLetter: string;
  value: string;
};

const BACKEND_URL =
  "https://learning-made-easy-backend.vercel.app";

const TEST_DURATION_SECONDS = 15 * 60;

const DISPLAY_LETTERS = [
  "A",
  "B",
  "C",
  "D",
];

/*
 * Fisher-Yates shuffle.
 */
function shuffleArray<T>(
  array: T[]
): T[] {
  const shuffled = [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffled[i],
      shuffled[randomIndex],
    ] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

/*
 * Create a balanced sequence of correct-answer
 * positions so correct answers do not always
 * appear in the same displayed position.
 */
function createBalancedCorrectPositions(
  questionCount: number
): string[] {
  const positions: string[] = [];

  for (
    let i = 0;
    i < questionCount;
    i++
  ) {
    positions.push(
      DISPLAY_LETTERS[
        i % DISPLAY_LETTERS.length
      ]
    );
  }

  return shuffleArray(positions);
}

/*
 * Shuffle displayed answer options while keeping
 * the original database answer letter.
 */
function createShuffledOptions(
  questions: Question[]
): Record<
  number,
  ShuffledOption[]
> {
  const result: Record<
    number,
    ShuffledOption[]
  > = {};

  const correctPositions =
    createBalancedCorrectPositions(
      questions.length
    );

  questions.forEach(
    (
      question,
      questionIndex
    ) => {
      const originalOptions: ShuffledOption[] =
        [
          {
            displayLetter: "",
            originalLetter: "A",
            value: question.option_a,
          },
          {
            displayLetter: "",
            originalLetter: "B",
            value: question.option_b,
          },
          {
            displayLetter: "",
            originalLetter: "C",
            value: question.option_c,
          },
          {
            displayLetter: "",
            originalLetter: "D",
            value: question.option_d,
          },
        ];

      const rawCorrectAnswer =
        String(
          question.correct_answer ||
            ""
        ).trim();

      const normalizedCorrectAnswer =
        rawCorrectAnswer
          .toUpperCase()
          .replace(/[\s().:]/g, "");

      let originalCorrectLetter =
        normalizedCorrectAnswer;

      /*
       * Support databases where correct_answer
       * contains the actual answer text.
       */
      if (
        !DISPLAY_LETTERS.includes(
          originalCorrectLetter
        )
      ) {
        const matchingOption =
          originalOptions.find(
            (option) =>
              option.value
                .trim()
                .toLowerCase() ===
              rawCorrectAnswer
                .toLowerCase()
          );

        if (matchingOption) {
          originalCorrectLetter =
            matchingOption.originalLetter;
        }
      }

      const targetCorrectPosition =
        correctPositions[
          questionIndex
        ];

      const correctOption =
        originalOptions.find(
          (option) =>
            option.originalLetter ===
            originalCorrectLetter
        );

      /*
       * Safety fallback for invalid answer data.
       */
      if (!correctOption) {
        const fallback =
          shuffleArray(
            originalOptions
          ).map(
            (
              option,
              index
            ) => ({
              ...option,
              displayLetter:
                DISPLAY_LETTERS[
                  index
                ],
            })
          );

        result[question.id] =
          fallback;

        return;
      }

      const distractors =
        originalOptions.filter(
          (option) =>
            option.originalLetter !==
            originalCorrectLetter
        );

      const shuffledDistractors =
        shuffleArray(
          distractors
        );

      const finalOptions: ShuffledOption[] =
        [];

      let distractorIndex = 0;

      DISPLAY_LETTERS.forEach(
        (displayLetter) => {
          if (
            displayLetter ===
            targetCorrectPosition
          ) {
            finalOptions.push({
              ...correctOption,
              displayLetter,
            });
          } else {
            const distractor =
              shuffledDistractors[
                distractorIndex
              ];

            distractorIndex++;

            finalOptions.push({
              ...distractor,
              displayLetter,
            });
          }
        }
      );

      result[question.id] =
        finalOptions;
    }
  );

  return result;
}

function CBTTestContent() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const courseId =
    searchParams.get(
      "courseId"
    );

  const [accessCode, setAccessCode] =
    useState("");

  const [studentEmail, setStudentEmail] =
    useState("");

  const [
    selectedCourseId,
    setSelectedCourseId,
  ] = useState("");

  const [
    accessVerified,
    setAccessVerified,
  ] = useState(false);

  const [
    questions,
    setQuestions,
  ] = useState<Question[]>([]);

  const [
    answers,
    setAnswers,
  ] = useState<Answer[]>([]);

  const [
    shuffledOptions,
    setShuffledOptions,
  ] = useState<
    Record<
      number,
      ShuffledOption[]
    >
  >({});

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [
    loadingQuestions,
    setLoadingQuestions,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(
    TEST_DURATION_SECONDS
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /*
   * COURSE INFORMATION
   */
  const getCourseName = () => {
    switch (
      Number(selectedCourseId)
    ) {
      case 1:
        return "GST 112 — The Nigerian People and Culture";

      case 2:
        return "GST 202 — Philosophy and Logic for Human Existence";

      case 3:
        return "GST 312 — Venture Creation";

      case 4:
        return "GST 312 — Peace and Conflict Resolution";

      default:
        return "CBT Examination";
    }
  };

  /*
   * GET ACCESS INFORMATION
   */
  useEffect(() => {
    const storedAccessCode =
      sessionStorage.getItem(
        "cbtAccessCode"
      );

    const storedStudentEmail =
      sessionStorage.getItem(
        "cbtStudentEmail"
      );

    const storedCourseId =
      sessionStorage.getItem(
        "cbtCourseId"
      );

    if (
      !storedAccessCode ||
      !storedStudentEmail ||
      !courseId
    ) {
      router.replace("/cbt");
      return;
    }

    /*
     * Prevent changing the course ID manually.
     */
    if (
      storedCourseId &&
      String(
        storedCourseId
      ) !==
        String(courseId)
    ) {
      router.replace("/cbt");
      return;
    }

    setAccessCode(
      storedAccessCode
    );

    setStudentEmail(
      storedStudentEmail
    );

    setSelectedCourseId(
      courseId
    );

    setLoading(false);
  }, [
    courseId,
    router,
  ]);

  /*
   * VERIFY CBT ACCESS
   */
  useEffect(() => {
    if (
      !accessCode ||
      !studentEmail ||
      !selectedCourseId
    ) {
      return;
    }

    const verifyAccess =
      async () => {
        try {
          setError("");

          const response =
            await fetch(
              `${BACKEND_URL}/api/cbt/access/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                cache: "no-store",
                body: JSON.stringify({
                  access_code:
                    accessCode,

                  email:
                    studentEmail,

                  course:
                    selectedCourseId,
                }),
              }
            );

          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "CBT access verification failed."
            );
          }

          setAccessVerified(
            true
          );
        } catch (err) {
          console.error(
            "CBT access verification failed:",
            err
          );

          sessionStorage.removeItem(
            "cbtAccessCode"
          );

          sessionStorage.removeItem(
            "cbtStudentEmail"
          );

          sessionStorage.removeItem(
            "cbtCourseId"
          );

          sessionStorage.removeItem(
            "cbtCourse"
          );

          sessionStorage.removeItem(
            "cbtVerifiedCourse"
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to verify CBT access."
          );

          setTimeout(() => {
            router.replace(
              "/cbt"
            );
          }, 2000);
        }
      };

    verifyAccess();
  }, [
    accessCode,
    studentEmail,
    selectedCourseId,
    router,
  ]);

  /*
   * LOAD A FRESH RANDOMIZED QUESTION SET
   *
   * IMPORTANT:
   *
   * The backend already:
   *
   * 1. Gets ALL questions for the course.
   * 2. Shuffles the entire bank.
   * 3. Selects 50.
   *
   * The cache-busting parameter and
   * cache: "no-store" ensure this frontend
   * does not reuse an old response.
   */
  useEffect(() => {
    if (
      !accessVerified ||
      !selectedCourseId ||
      !accessCode ||
      !studentEmail
    ) {
      return;
    }

    const loadQuestions =
      async () => {
        try {
          setLoadingQuestions(
            true
          );

          setError("");

          /*
           * Clear the previous test's
           * temporary question/answer data.
           *
           * This makes sure an old set of
           * 50 questions is never reused
           * as the current test.
           */
          sessionStorage.removeItem(
            "cbtQuestions"
          );

          sessionStorage.removeItem(
            "cbtAnswers"
          );

          sessionStorage.removeItem(
            "cbtReview"
          );

          sessionStorage.removeItem(
            "cbtResult"
          );

          /*
           * Start this fresh attempt
           * with a fresh 15-minute timer.
           */
          const newStartTime =
            Date.now();

          sessionStorage.setItem(
            "cbtStartTime",
            newStartTime.toString()
          );

          setTimeLeft(
            TEST_DURATION_SECONDS
          );

          /*
           * Date.now() creates a unique
           * cache-busting value.
           *
           * This prevents an old 50-question
           * response from being reused.
           */
          const cacheBuster =
            Date.now();

          const response =
            await fetch(
              `${BACKEND_URL}/api/cbt/questions/${selectedCourseId}?limit=50&_=${cacheBuster}`,
              {
                method: "GET",

                headers: {
                  "Content-Type":
                    "application/json",

                  "x-cbt-access-code":
                    accessCode,

                  "x-cbt-email":
                    studentEmail,
                },

                /*
                 * Never use a cached question set.
                 */
                cache: "no-store",
              }
            );

          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load CBT questions."
            );
          }

          const loadedQuestions:
            Question[] =
            data.questions || [];

          if (
            loadedQuestions.length ===
            0
          ) {
            throw new Error(
              "No CBT questions are available for this course."
            );
          }

          /*
           * The backend has already
           * randomized the complete bank
           * before selecting these questions.
           */
          setQuestions(
            loadedQuestions
          );

          /*
           * Shuffle the displayed answer
           * positions separately.
           */
          const newShuffledOptions =
            createShuffledOptions(
              loadedQuestions
            );

          setShuffledOptions(
            newShuffledOptions
          );

          /*
           * Every new test starts
           * with unanswered questions.
           */
          const initialAnswers:
            Answer[] =
            loadedQuestions.map(
              (question) => ({
                question_id:
                  question.id,

                answer: "",
              })
            );

          setAnswers(
            initialAnswers
          );

          setCurrentQuestion(
            0
          );
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
          setLoadingQuestions(
            false
          );
        }
      };

    loadQuestions();
  }, [
    accessVerified,
    selectedCourseId,
    accessCode,
    studentEmail,
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

    if (timeLeft <= 0) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) =>
            previous > 0
              ? previous - 1
              : 0
        );
      }, 1000);

    return () =>
      clearInterval(timer);
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
  const formatTime = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${minutes
      .toString()
      .padStart(
        2,
        "0"
      )}:${remainingSeconds
      .toString()
      .padStart(
        2,
        "0"
      )}`;
  };

  /*
   * SELECT ANSWER
   *
   * IMPORTANT:
   *
   * The displayed letter is NOT sent
   * to the backend.
   *
   * The original database letter is sent.
   */
  const handleAnswer = (
    displayLetter: string
  ) => {
    if (
      submitting ||
      !questions[currentQuestion]
    ) {
      return;
    }

    const question =
      questions[currentQuestion];

    const options =
      shuffledOptions[
        question.id
      ] || [];

    const selectedOption =
      options.find(
        (option) =>
          option.displayLetter ===
          displayLetter
      );

    if (!selectedOption) {
      return;
    }

    const questionId =
      question.id;

    setAnswers(
      (previous) =>
        previous.map(
          (item) =>
            item.question_id ===
            questionId
              ? {
                  ...item,
                  answer:
                    selectedOption.originalLetter,
                }
              : item
        )
    );
  };

  /*
   * GET ORIGINAL DATABASE ANSWER
   */
  const getCurrentAnswer =
    () => {
      if (
        !questions[
          currentQuestion
        ]
      ) {
        return "";
      }

      const questionId =
        questions[
          currentQuestion
        ].id;

      const answer =
        answers.find(
          (item) =>
            item.question_id ===
            questionId
        );

      return (
        answer?.answer || ""
      );
    };

  /*
   * GET DISPLAYED ANSWER
   */
  const getCurrentDisplayedAnswer =
    () => {
      if (
        !questions[
          currentQuestion
        ]
      ) {
        return "";
      }

      const question =
        questions[
          currentQuestion
        ];

      const originalAnswer =
        getCurrentAnswer();

      if (!originalAnswer) {
        return "";
      }

      const options =
        shuffledOptions[
          question.id
        ] || [];

      const selectedOption =
        options.find(
          (option) =>
            option.originalLetter ===
            originalAnswer
        );

      return (
        selectedOption
          ?.displayLetter || ""
      );
    };

  /*
   * SUBMIT CBT
   */
  const handleSubmit =
    async () => {
      if (submitting) {
        return;
      }

      if (
        !accessCode ||
        !studentEmail ||
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
        const response =
          await fetch(
            `${BACKEND_URL}/api/cbt/submit`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                access_code:
                  accessCode,

                email:
                  studentEmail,

                course_id:
                  Number(
                    selectedCourseId
                  ),

                answers:
                  answers.map(
                    (item) => ({
                      question_id:
                        Number(
                          item.question_id
                        ),

                      answer:
                        item.answer ||
                        "",
                    })
                  ),
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "CBT SUBMISSION RESPONSE:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to submit CBT."
          );
        }

        /*
         * SAVE RESULT
         */
        const result = {
          score:
            data.score ?? 0,

          total_questions:
            data.total_questions ??
            questions.length,

          percentage:
            data.percentage ?? 0,

          courseId:
            selectedCourseId,

          completedAt:
            new Date().toISOString(),
        };

        sessionStorage.setItem(
          "cbtResult",
          JSON.stringify(
            result
          )
        );

        /*
         * Save the questions used
         * in this particular attempt.
         */
        sessionStorage.setItem(
          "cbtQuestions",
          JSON.stringify(
            questions
          )
        );

        /*
         * Save student's answers.
         */
        sessionStorage.setItem(
          "cbtAnswers",
          JSON.stringify(
            answers
          )
        );

        /*
         * SAVE BACKEND REVIEW.
         *
         * This contains:
         *
         * - question
         * - student's answer
         * - correct answer
         * - correct answer text
         * - whether the answer was correct
         * - explanation
         */
        sessionStorage.setItem(
          "cbtReview",
          JSON.stringify(
            data.review || []
          )
        );

        /*
         * Remove active timer.
         */
        sessionStorage.removeItem(
          "cbtStartTime"
        );

        /*
         * Go to result page.
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
        (previous) =>
          previous + 1
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
    if (
      currentQuestion > 0
    ) {
      setCurrentQuestion(
        (previous) =>
          previous - 1
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
            type="button"
            onClick={() =>
              router.replace(
                "/cbt"
              )
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

  const options =
    shuffledOptions[
      question.id
    ] || [];

  const currentDisplayedAnswer =
    getCurrentDisplayedAnswer();

  const answeredCount =
    answers.filter(
      (answer) =>
        answer.answer !== ""
    ).length;

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  const isLastQuestion =
    currentQuestion ===
    questions.length - 1;

  const timerWarning =
    timeLeft <=
    5 * 60;

  /*
   * CBT INTERFACE
   */
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <header className="sticky top-0 z-20 border-b border-[#2B2022]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A65D6F]">
                CAMPUS LEARNING HUB
              </p>

              <h1 className="mt-1 text-lg font-bold text-[#2B2022] sm:text-xl">
                CBT Examination
              </h1>

              <p className="mt-1 max-w-xl truncate text-xs font-medium text-[#6B2638] sm:text-sm">
                {getCourseName()}
              </p>
            </div>

            <div
              className={`shrink-0 rounded-xl border px-4 py-2 text-center ${
                timerWarning
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-[#C89B5D]/30 bg-[#C89B5D]/10 text-[#6B2638]"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider">
                Time Left
              </p>

              <p className="text-lg font-bold tabular-nums">
                {formatTime(
                  timeLeft
                )}
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
              Question{" "}
              {currentQuestion + 1}{" "}
              of{" "}
              {questions.length}
            </p>

            <p className="mt-1 text-xs text-[#2B2022]/50">
              {answeredCount}{" "}
              answered
            </p>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2B2022]/60 shadow-sm">
            {Math.round(
              progress
            )}
            % Complete
          </div>
        </div>

        <section className="rounded-2xl border border-[#2B2022]/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#A65D6F]">
              Question{" "}
              {
                question.question_number
              }
            </p>

            <h2 className="text-lg font-semibold leading-8 text-[#2B2022] sm:text-xl">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {options.map(
              (option) => {
                const selected =
                  currentDisplayedAnswer ===
                  option.displayLetter;

                return (
                  <button
                    key={`${question.id}-${option.displayLetter}`}
                    type="button"
                    onClick={() =>
                      handleAnswer(
                        option.displayLetter
                      )
                    }
                    disabled={
                      submitting
                    }
                    aria-pressed={
                      selected
                    }
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
                      {
                        option.displayLetter
                      }
                    </span>

                    <span
                      className={`pt-1 text-sm leading-6 sm:text-base ${
                        selected
                          ? "font-semibold text-[#2B2022]"
                          : "text-[#2B2022]/80"
                      }`}
                    >
                      {
                        option.value
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={
              handlePrevious
            }
            disabled={
              currentQuestion ===
                0 ||
              submitting
            }
            className="rounded-xl border border-[#2B2022]/10 bg-white px-6 py-3 font-semibold text-[#2B2022] transition hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={
                handleNext
              }
              disabled={
                submitting
              }
              className="rounded-xl bg-[#6B2638] px-7 py-3 font-semibold text-white transition hover:bg-[#571f2e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                submitting
              }
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
            Your test will be
            submitted
            automatically
            when the timer
            reaches zero.
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