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

export default function CBTPage() {
  const [accessCode, setAccessCode] = useState("");
  const [showCourses, setShowCourses] = useState(false);
  const [error, setError] = useState("");

  function continueToCourses() {
    const code = accessCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter your access code.");
      return;
    }

    if (code.length < 6) {
      setError("Please enter a valid access code.");
      return;
    }

    sessionStorage.setItem("cbtAccessCode", code);
    setAccessCode(code);
    setError("");
    setShowCourses(true);
  }

  function changeCode() {
    sessionStorage.removeItem("cbtAccessCode");
    sessionStorage.removeItem("cbtStudent");
    setAccessCode("");
    setShowCourses(false);
    setError("");
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

          <Link
            href="/"
            className="text-sm font-medium text-[#2B2022]/60 transition hover:text-[#6B2638]"
          >
            ← Back Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {!showCourses ? (
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-medium text-[#6B2638]">
                CBT Practice
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                Enter Your Access Code
              </h1>

              <p className="mt-5 text-lg leading-8 text-[#2B2022]/60">
                Enter the access code you received after purchasing CBT access
                to continue.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-[#6B2638]/10 bg-white p-8 shadow-sm">
              <label
                htmlFor="accessCode"
                className="block text-sm font-semibold text-[#2B2022]"
              >
                Access Code
              </label>

              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    continueToCourses();
                  }
                }}
                placeholder="e.g. GST112-DG16N"
                className="mt-3 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-4 text-center font-semibold tracking-wider text-[#2B2022] outline-none transition focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
              />

              {error && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={continueToCourses}
                className="mt-6 w-full rounded-xl bg-[#6B2638] px-5 py-4 font-semibold text-white transition hover:bg-[#561E2D]"
              >
                Continue
              </button>

              <p className="mt-5 text-center text-sm leading-6 text-[#2B2022]/50">
                Your access code will be verified when you select your course
                and begin the CBT.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#2B2022]/50">
                Don't have an access code?
              </p>

              <Link
                href="/"
                className="mt-2 inline-block text-sm font-semibold text-[#6B2638] hover:underline"
              >
                Get CBT Access
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-medium text-[#6B2638]">
                Access Code Accepted
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                Choose Your Course
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#2B2022]/60">
                Select the course you purchased to begin your CBT practice.
              </p>

              <p className="mt-3 text-sm font-semibold text-[#6B2638]">
                Access Code: {accessCode}
              </p>
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

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={changeCode}
                className="text-sm font-semibold text-[#6B2638] hover:underline"
              >
                ← Use a different access code
              </button>
            </div>
          </>
        )}

        <div className="mt-12 rounded-2xl border border-[#6B2638]/10 bg-[#6B2638]/4 p-6">
          <h3 className="font-semibold text-[#2B2022]">
            How CBT practice works
          </h3>

          <div className="mt-4 grid gap-4 text-sm text-[#2B2022]/60 md:grid-cols-3">
            <div>
              <span className="font-semibold text-[#6B2638]">01.</span>{" "}
              Enter your access code
            </div>

            <div>
              <span className="font-semibold text-[#6B2638]">02.</span>{" "}
              Choose your course
            </div>

            <div>
              <span className="font-semibold text-[#6B2638]">03.</span>{" "}
              Complete the CBT and view your result
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 h-1 w-16 rounded-full bg-[#C89B5D]" />
      </section>
    </main>
  );
}