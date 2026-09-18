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
            <a
              href="#features"
              className="text-sm text-slate-300 hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-300 hover:text-white"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm text-slate-300 hover:text-white"
            >
              Pricing
            </a>
            <a
              href="/cbt"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              CBT Practice
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
            Learn with an AI academic assistant built around your course
            materials, and prepare for your exams with our CBT practice space.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/payment"
              className="rounded-xl bg-blue-500 px-7 py-3.5 text-center font-semibold hover:bg-blue-400"
            >
              Get CBT Access — ₦500
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
                <h3 className="mt-1 text-xl font-bold">Welcome 👋</h3>
              </div>

              <div className="h-10 w-10 rounded-full bg-blue-500" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">AI Assistant</p>
                <p className="mt-2 text-lg font-semibold">
                  Academic assistance
                </p>

                <div className="mt-4 rounded-lg bg-white/5 px-4 py-3 text-sm text-slate-400">
                  🔒 Coming Soon
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">CBT Practice</p>
                <p className="mt-2 text-lg font-semibold">
                  Test your knowledge and boost your confidence.
                </p>

                <a
                  href="/cbt"
                  className="mt-4 block rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-300 hover:bg-green-500/20"
                >
                  Take a test →
                </a>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">CBT Access</p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[78%] rounded-full bg-blue-500" />
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-400">Practice progress</span>
                <span className="font-semibold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-white/10 bg-slate-900/50"
      >
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
              practice into one simple student platform for excellence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* AI */}
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                AI
              </div>

              <h3 className="text-2xl font-bold">
                AI Academic Assistant
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Ask questions and get student-friendly explanations based on
                your available course materials.
              </p>

              <div className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-400">
                🔒 Coming Soon
              </div>
            </div>

            {/* CBT */}
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
                CBT
              </div>

              <h3 className="text-2xl font-bold">CBT Practice</h3>

              <p className="mt-4 leading-7 text-slate-400">
                Practice with possible questions from your course question
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
                text: "Purchase CBT access and receive your unique access code.",
              },
              {
                number: "02",
                title: "Learn & practice",
                text: "Use your access code to enter your course and take CBT practice tests.",
              },
              {
                number: "03",
                title: "Track performance",
                text: "Submit your test and review your performance and answers.",
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

                <p className="mt-3 leading-7 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-y border-white/10 bg-slate-900/50"
      >
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
            {/* AI Weekly */}
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-7">
              <h3 className="text-xl font-bold">AI Weekly</h3>

              <p className="mt-5 text-4xl font-bold">₦500</p>

              <p className="mt-4 min-h-12 text-slate-400">
                7 days of AI academic assistance.
              </p>

              <div className="mt-7 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-slate-500">
                🔒 Coming Soon
              </div>
            </div>

            {/* AI Semester */}
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-7">
              <h3 className="text-xl font-bold">AI Semester</h3>

              <p className="mt-5 text-4xl font-bold">₦1,000</p>

              <p className="mt-4 min-h-12 text-slate-400">
                AI academic assistance for the semester.
              </p>

              <div className="mt-7 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-slate-500">
                🔒 Coming Soon
              </div>
            </div>

            {/* CBT */}
            <div className="rounded-3xl border border-green-500/20 bg-slate-950 p-7">
              <h3 className="text-xl font-bold">CBT</h3>

              <p className="mt-5 text-4xl font-bold">₦500</p>

              <p className="mt-4 min-h-12 text-slate-400">
                Lifetime access to CBT practice.
              </p>

              <a
                href="/payment"
                className="mt-7 block rounded-xl bg-green-500 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-green-400"
              >
                Get CBT Access
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold md:text-5xl">
          Ready to prepare better?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Study smarter, practice consistently, and prepare with confidence.
        </p>

        <a
          href="/payment"
          className="mt-8 inline-block rounded-xl bg-blue-500 px-8 py-4 font-semibold hover:bg-blue-400"
        >
          Get CBT Access — ₦500
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 CAMPUS LEARNING HUB. All rights reserved.</p>
          <p>Learn smarter. Prepare better.</p>
        </div>
              {/* WhatsApp Community */}
      <section className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 text-green-400"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.79 11.79 0 0 0 12.06 0C5.53 0 .22 5.31.22 11.84c0 2.09.55 4.13 1.59 5.93L.13 24l6.37-1.67a11.8 11.8 0 0 0 5.56 1.41h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.14-3.39-8.42ZM12.07 21.8h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.82 9.82 0 1 1 8.38 4.65Zm5.39-7.36c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.58-.89-2.17-.23-.57-.47-.5-.65-.51h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43s1.04 2.82 1.19 3.01c.15.19 2.04 3.12 4.94 4.37.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.37-.07-.12-.27-.19-.56-.34Z" />
            </svg>
          </div>

          <h2 className="mt-6 text-2xl font-bold md:text-3xl">
            Join our WhatsApp Support Community
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Join our WhatsApp support community for more updates,
            announcements, and support from CAMPUS LEARNING HUB.
          </p>

          <a
            href="https://chat.whatsapp.com/Fuc0t8KU2MTFfMi58PvBuc?s=cl&p=a&mlu=4&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-green-400"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.79 11.79 0 0 0 12.06 0C5.53 0 .22 5.31.22 11.84c0 2.09.55 4.13 1.59 5.93L.13 24l6.37-1.67a11.8 11.8 0 0 0 5.56 1.41h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.14-3.39-8.42ZM12.07 21.8h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.82 9.82 0 1 1 8.38 4.65Zm5.39-7.36c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.58-.89-2.17-.23-.57-.47-.5-.65-.51h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43s1.04 2.82 1.19 3.01c.15.19 2.04 3.12 4.94 4.37.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.37-.07-.12-.27-.19-.56-.34Z" />
            </svg>
            Join WhatsApp Community
          </a>
        </div>
      </section>
      </footer>
    </main>
  );
 }