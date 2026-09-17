import Link from "next/link";

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
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2022]">
      {/* Header */}
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

      {/* Main */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-medium text-[#6B2638]">
            CBT Practice
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#2B2022] md:text-5xl">
            Choose Your Course
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#2B2022]/60">
            Select a course to begin your practice and test your understanding.
          </p>
        </div>

        {/* Course Cards */}
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

        {/* How it works */}
        <div className="mt-10 rounded-2xl border border-[#6B2638]/10 bg-[#6B2638]/4 p-6">
          <h3 className="font-semibold text-[#2B2022]">
            How CBT practice works
          </h3>

          <div className="mt-4 grid gap-4 text-sm text-[#2B2022]/60 md:grid-cols-3">
            <div>
              <span className="font-semibold text-[#6B2638]">01.</span>{" "}
              Choose your course
            </div>

            <div>
              <span className="font-semibold text-[#6B2638]">02.</span>{" "}
              Complete the questions
            </div>

            <div>
              <span className="font-semibold text-[#6B2638]">03.</span>{" "}
              Submit and view your result
            </div>
          </div>
        </div>

        {/* Small accent */}
        <div className="mx-auto mt-12 h-1 w-16 rounded-full bg-[#C89B5D]" />
      </section>
    </main>
  );
}