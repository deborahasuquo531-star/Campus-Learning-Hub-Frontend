export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">CAMPUS LEARNING HUB</h1>
            <p className="text-xs text-slate-400">
              Learn smarter. Prepare better.
            </p>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-300 hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white">
              Pricing
            </a>
            <a
              href="/login"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
            Your academic companion
          </div>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Your learning,
            <span className="block text-blue-400">made easier.</span>
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Learn with an AI academic assistant trained around your course
            materials, then test yourself with randomized CBT practice.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/login"
              className="rounded-xl bg-blue-500 px-7 py-3.5 text-center font-semibold hover:bg-blue-400"
            >
              Get Started
            </a>

            <a
              href="#features"
              className="rounded-xl border border-white/15 px-7 py-3.5 text-center font-semibold text-slate-200 hover:bg-white/5"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
          <div className="rounded-2xl bg-slate-900 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Student Dashboard</p>
                <h3 className="mt-1 text-xl font-bold">Welcome back 👋</h3>
              </div>

              <div className="h-10 w-10 rounded-full bg-blue-500" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">AI Assistant</p>
                <p className="mt-2 text-lg font-semibold">
                  Ask anything about your course
                </p>
                <div className="mt-4 rounded-lg bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
                  Start learning →
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">CBT Practice</p>
                <p className="mt-2 text-lg font-semibold">
                  Test your knowledge
                </p>
                <div className="mt-4 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  Take a test →
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Recent Performance</p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[78%] rounded-full bg-blue-500" />
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-400">Overall progress</span>
                <span className="font-semibold">78%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Learn. Practice. Improve.
            </h2>

            <p className="mt-4 text-slate-400">
              CAMPUS LEARNING HUB combines academic assistance and examination
              practice into one simple student platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                AI
              </div>

              <h3 className="text-2xl font-bold">AI Academic Assistant</h3>

              <p className="mt-4 leading-7 text-slate-400">
                Ask questions and get student-friendly explanations based on
                your available course materials.
              </p>

              <a
                href="/ai"
                className="mt-6 inline-block font-semibold text-blue-400"
              >
                Explore AI Assistant →
              </a>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
                CBT
              </div>

              <h3 className="text-2xl font-bold">CBT Practice</h3>

              <p className="mt-4 leading-7 text-slate-400">
                Practice with randomized questions from your course question
                bank and see your performance after submitting.
              </p>

              <a
                href="/cbt"
                className="mt-6 inline-block font-semibold text-green-400"
              >
                Start CBT Practice →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Simple process
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              How it works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Get access",
                text: "Choose the learning or CBT option that fits your needs.",
              },
              {
                number: "02",
                title: "Learn & practice",
                text: "Study with the AI assistant or take randomized CBT questions.",
              },
              {
                number: "03",
                title: "Track progress",
                text: "Review your performance and identify areas to improve.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-3xl border border-white/10 bg-slate-900 p-8"
              >
                <p className="text-4xl font-bold text-blue-500">
                  {item.number}
                </p>

                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Pricing
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Choose what you need
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                title: "AI Weekly",
                price: "₦500",
                description: "7 days of AI academic assistance.",
              },
              {
                title: "AI Semester",
                price: "₦1,000",
                description: "AI academic assistance for the semester.",
              },
              {
                title: "CBT",
                price: "₦500",
                description: "Lifetime access to CBT practice.",
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className="rounded-3xl border border-white/10 bg-slate-950 p-7"
              >
                <h3 className="text-xl font-bold">{plan.title}</h3>

                <p className="mt-5 text-4xl font-bold">{plan.price}</p>

                <p className="mt-4 min-h-12 text-slate-400">
                  {plan.description}
                </p>

                <a
                  href="/pricing"
                  className="mt-7 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Get Access
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold md:text-5xl">
          Ready to make learning easier?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Study smarter, practice consistently, and understand your courses
          better.
        </p>

        <a
          href="/login"
          className="mt-8 inline-block rounded-xl bg-blue-500 px-8 py-4 font-semibold hover:bg-blue-400"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 CAMPUS LEARNING HUB. All rights reserved.</p>
          <p>Learn smarter. Prepare better.</p>
        </div>
      </footer>
    </main>
  );
}