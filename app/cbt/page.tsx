"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const courses = [
  {
    id: 1,
    code: "GST 112",
    title: "The Nigerian People and Culture",
    description:
      "Practice your understanding of Nigerian people, culture, social institutions, religion, law, and related topics.",
  },
  {
    id: 2,
    code: "GST 202",
    title: "Philosophy and Logic for Human Existence",
    description:
      "Test your understanding of philosophy, logic, ethics, African philosophy, science, technology, health, and related topics.",
  },
];

const API_URL = "https://learning-made-easy-backend.vercel.app";

export default function CBTPage() {
  const [accessCode, setAccessCode] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [verifiedCourseId, setVerifiedCourseId] = useState<number | null>(
    null
  );
  const [verifiedCourse, setVerifiedCourse] = useState<
    (typeof courses)[number] | null
  >(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restore previously saved CBT access information if available.
  useEffect(() => {
    const storedAccessCode = sessionStorage.getItem("cbtAccessCode");
    const storedStudentEmail = sessionStorage.getItem("cbtStudentEmail");
    const storedCourseId = sessionStorage.getItem("cbtCourseId");
    const storedCourse = sessionStorage.getItem("cbtCourse");

    if (storedAccessCode) {
      setAccessCode(storedAccessCode);
    }

    if (storedStudentEmail) {
      setStudentEmail(storedStudentEmail);
    }

    if (storedCourseId) {
      const courseId = Number(storedCourseId);
      const course = courses.find((item) => item.id === courseId);

      if (course) {
        setVerifiedCode(storedAccessCode);
        setVerifiedCourseId(course.id);
        setVerifiedCourse(course);

        if (storedCourse) {
          try {
            const parsedCourse = JSON.parse(storedCourse);

            if (parsedCourse?.id === course.id) {
              setVerifiedCourse(parsedCourse);
            }
          } catch {
            // Keep the course from the local course list.
          }
        }
      }
    }
  }, []);

  async function verifyAccessCode() {
    const code = accessCode.trim().toUpperCase();
    const email = studentEmail.trim().toLowerCase();

    if (!email) {
      setError("Please enter the email address you used for payment.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!code) {
      setError("Please enter your CBT access code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let matchedCourse: (typeof courses)[number] | null = null;
      let matchedData: any = null;

      // Check the access code + payment email against BOTH courses.
      // This allows GST 112 and GST 202 students to use their own
      // access independently at the same time.
      for (const course of courses) {
        try {
          const response = await fetch(
            `${API_URL}/api/cbt/access/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_code: code,
                course: String(course.id),
                email,
              }),
            }
          );

          const data = await response.json();

          if (response.ok && data.success) {
            matchedCourse = course;
            matchedData = data;
            break;
          }
        } catch (courseError) {
          console.error(
            `Verification failed for course ${course.id}:`,
            courseError
          );
        }
      }

      // The code + email did not match either course.
      if (!matchedCourse || !matchedData) {
        throw new Error(
          "Invalid access code or payment email. Please make sure you are using the email address used for your CBT payment."
        );
      }

      // Save verified access information.
      sessionStorage.setItem("cbtAccessCode", code);
      sessionStorage.setItem("cbtStudentEmail", email);

      sessionStorage.setItem(
        "cbtCourseId",
        String(matchedCourse.id)
      );

      sessionStorage.setItem(
        "cbtCourse",
        JSON.stringify(matchedCourse)
      );

      if (matchedData.student) {
        sessionStorage.setItem(
          "cbtStudent",
          JSON.stringify(matchedData.student)
        );
      }

      if (matchedData.course) {
        sessionStorage.setItem(
          "cbtVerifiedCourse",
          JSON.stringify(matchedData.course)
        );
      }

      setAccessCode(code);
      setStudentEmail(email);
      setVerifiedCode(code);
      setVerifiedCourseId(matchedCourse.id);
      setVerifiedCourse(matchedCourse);
    } catch (error) {
      console.error("CBT access verification failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify your access. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ACCESS CODE SCREEN
  if (!verifiedCode || !verifiedCourseId || !verifiedCourse) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
        <header className="border-b border-[#6B2638]/10 bg-[#FAF7F2]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[#6B2638]"
            >
              CAMPUS LEARNING HUB
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-[#2B2022]/60 transition hover:text-[#6B2638]"
            >
              ← Back Home
            </Link>
          </div>
        </header>

        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="text-center">
              <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-medium text-[#6B2638]">
                CBT Practice
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#2B2022]">
                Enter Your Access Details
              </h1>

              <p className="mt-4 leading-7 text-[#2B2022]/60">
                Enter the email address you used for payment and the
                CBT access code you received.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-[#6B2638]/10 bg-white p-8 shadow-sm">
              <label
                htmlFor="studentEmail"
                className="block text-sm font-semibold text-[#2B2022]"
              >
                Payment Email
              </label>

              <input
                id="studentEmail"
                type="email"
                value={studentEmail}
                onChange={(event) => {
                  setStudentEmail(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    verifyAccessCode();
                  }
                }}
                placeholder="Enter the email used for payment"
                autoComplete="email"
                className="mt-3 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 font-medium text-[#2B2022] outline-none transition placeholder:text-[#2B2022]/35 focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#2B2022]/45">
                Use the same email address you entered when making
                your CBT payment.
              </p>

              <label
                htmlFor="accessCode"
                className="mt-6 block text-sm font-semibold text-[#2B2022]"
              >
                CBT Access Code
              </label>

              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(event) => {
                  setAccessCode(event.target.value.toUpperCase());
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    verifyAccessCode();
                  }
                }}
                placeholder="Enter your access code"
                autoComplete="off"
                className="mt-3 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 font-medium uppercase tracking-wider text-[#2B2022] outline-none transition placeholder:normal-case placeholder:tracking-normal focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
              />

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={verifyAccessCode}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-[#6B2638] px-5 py-3.5 font-semibold text-white transition hover:bg-[#561E2D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying Access..." : "Continue"}
              </button>

              <p className="mt-5 text-center text-xs leading-5 text-[#2B2022]/45">
                Your payment email, access code, and course are
                verified securely before you can begin a CBT.
              </p>
            </div>

            <div className="mx-auto mt-10 h-1 w-16 rounded-full bg-[#C89B5D]" />
          </div>
        </section>
      </main>
    );
  }

  // VERIFIED COURSE SCREEN
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
      <header className="border-b border-[#6B2638]/10 bg-[#FAF7F2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#6B2638]"
          >
            CAMPUS LEARNING HUB
          </Link>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("cbtAccessCode");
              sessionStorage.removeItem("cbtStudentEmail");
              sessionStorage.removeItem("cbtStudent");
              sessionStorage.removeItem("cbtCourse");
              sessionStorage.removeItem("cbtCourseId");
              sessionStorage.removeItem("cbtVerifiedCourse");

              setVerifiedCode(null);
              setVerifiedCourseId(null);
              setVerifiedCourse(null);
              setAccessCode("");
              setStudentEmail("");
              setError("");
            }}
            className="text-sm font-medium text-[#2B2022]/60 transition hover:text-[#6B2638]"
          >
            Change Code
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-medium text-[#6B2638]">
            Access Verified
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#2B2022] md:text-5xl">
            Your CBT Is Ready
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#2B2022]/60">
            Your access details have been verified successfully.
            You have access to the following course:
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-[#6B2638]/20 bg-white p-8 shadow-sm md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-[#6B2638]">
                {verifiedCourse.code}
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#2B2022]">
                {verifiedCourse.title}
              </h2>
            </div>

            <div className="rounded-xl bg-[#6B2638]/7 px-3 py-2 text-sm font-semibold text-[#6B2638]">
              CBT
            </div>
          </div>

          <p className="mt-5 leading-7 text-[#2B2022]/60">
            {verifiedCourse.description}
          </p>

          <div className="mt-6 rounded-2xl bg-[#FAF7F2] p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#2B2022]/40">
                  Course
                </p>
                <p className="mt-1 font-semibold text-[#2B2022]">
                  {verifiedCourse.code}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#2B2022]/40">
                  Access
                </p>
                <p className="mt-1 font-semibold text-[#2B2022]">
                  Lifetime
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#2B2022]/40">
                  Duration
                </p>
                <p className="mt-1 font-semibold text-[#2B2022]">
                  15 minutes
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/cbt/test?courseId=${verifiedCourse.id}`}
            className="mt-8 block rounded-xl bg-[#6B2638] px-5 py-4 text-center font-semibold text-white transition hover:bg-[#561E2D]"
          >
            Start {verifiedCourse.code} CBT
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-[#6B2638]/10 bg-[#6B2638]/4 p-6">
          <h3 className="font-semibold text-[#2B2022]">
            Before you begin
          </h3>

          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#2B2022]/60">
            <li>• You have 15 minutes to complete the test.</li>
            <li>
              • The test will automatically submit when the timer
              reaches zero.
            </li>
            <li>
              • Your score and corrected answer review will be shown
              after submission.
            </li>
            <li>
              • Your access code can be used again for future
              practice.
            </li>
          </ul>
        </div>

        <div className="mx-auto mt-12 h-1 w-16 rounded-full bg-[#C89B5D]" />
      </section>
    </main>
  );
}