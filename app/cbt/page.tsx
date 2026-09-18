"use client";

import Link from "next/link";
import { useState } from "react";

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

const API_URL =
  "https://learning-made-easy-backend.vercel.app";

export default function CBTPage() {
  const [accessCode, setAccessCode] = useState("");
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [showCourses, setShowCourses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function verifyAccessCode() {
    const code = accessCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter your CBT access code.");
      return;
    }

    setLoading(true);
    setError("");

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
            course: "1",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid or inactive access code."
        );
      }

      sessionStorage.setItem("cbtAccessCode", code);

      if (data.student) {
        sessionStorage.setItem(
          "cbtStudent",
          JSON.stringify(data.student)
        );
      }

      setVerifiedCode(code);
      setShowCourses(true);
    } catch (error) {
      console.error("CBT access verification failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify your access code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!showCourses) {
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
                Enter Your Access Code
              </h1>

              <p className="mt-4 leading-7 text-[#2B2022]/60">
                Enter the CBT access code you received after payment
                to continue.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-[#6B2638]/10 bg-white p-8 shadow-sm">
              <label
                htmlFor="accessCode"
                className="block text-sm font-semibold text-[#2B2022]"
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
                placeholder="e.g. GST112-DG16N"
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
                Your access code is verified securely before you can
                begin a CBT.
              </p>
            </div>

            <div className="mx-auto mt-10 h-1 w-16 rounded-full bg-[#C89B5D]" />
          </div>
        </section>
      </main>
    );
  }

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
              sessionStorage.removeItem("cbtStudent");
              setVerifiedCode(null);
              setShowCourses(false);
              setAccessCode("");
            }}
            className="text-sm font-medium text-[#2B2022]/60 transition hover:text-[#6B2638]"
          >
            Change Code
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-medium text-[#6B2638]">
            CBT Practice
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#2B2022] md:text-5xl">
            Choose Your Course
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#2B2022]/60">
            Your access code has been verified. Select a course to
            begin your practice.
          </p>

          {verifiedCode && (
            <p className="mt-3 text-sm font-semibold text-[#6B2638]">
              Access verified
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl border border-[#6B2638]/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-[#6B2638]">
                    {course.code}
                  </span>

                  <h2 className="mt-3 text-2xl font-bold text-[#2B2022]">
                    {course.title}
                  </h2>
                </div>

                <div className="rounded-xl bg-[#6B2638]/7 px-3 py-2 text-sm font-semibold text-[#6B2638]">
                  CBT
                </div>
              </div>

              <p className="mt-5 leading-7 text-[#2B2022]/60">
                {course.description}
              </p>

              <Link
                href={`/cbt/test?courseId=${course.id}`}
                className="mt-8 block rounded-xl bg-[#6B2638] px-5 py-3.5 text-center font-semibold text-white transition hover:bg-[#561E2D]"
              >
                Start {course.code} CBT
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#6B2638]/10 bg-[#6B2638]/4 p-6">
          <h3 className="font-semibold text-[#2B2022]">
            How CBT practice works
          </h3>

          <div className="mt-4 grid gap-4 text-sm text-[#2B2022]/60 md:grid-cols-3">
            <div>
              <span className="font-semibold text-[#6B2638]">
                01.
              </span>{" "}
              Verify your access
            </div>

            <div>
              <span className="font-semibold text-[#6B2638]">
                02.
              </span>{" "}
              Choose your course
            </div>

            <div>
              <span className="font-semibold text-[#6B2638]">
                03.
              </span>{" "}
              Complete the CBT and view your result
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 h-1 w-16 rounded-full bg-[#C89B5D]" />
      </section>
    </main>
  );
}