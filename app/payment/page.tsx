"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND_URL =
  "https://learning-made-easy-backend.vercel.app";

const courses = [
  {
    id: 1,
    code: "GST112",
    name: "GST 112 — The Nigerian People and Culture",
  },
  {
    id: 2,
    code: "GST202",
    name: "GST 202 — Philosophy and Logic for Human Existence",
  },
];

type PaymentStatus =
  | "form"
  | "verifying"
  | "success"
  | "failed";

export default function CBTPaymentPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    course: "1",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<PaymentStatus>("form");
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [verifiedCourse, setVerifiedCourse] =
    useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.search
    );

    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref");

    if (!reference) {
      return;
    }

    verifyPayment(reference);
  }, []);

  async function verifyPayment(reference: string) {
    setStatus("verifying");
    setError("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/cbt/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
      throw new Error(
      data.message ||
      data.error ||
      "Payment verification failed. Please contact support if you were charged."
      ); 
      }

      const code =
        data.access_code ||
        data.student?.access_code;

      if (!code) {
        throw new Error(
          "Payment was verified, but your access code could not be retrieved. Please contact support."
        );
      }

      const course =
        data.course ||
        data.student?.course ||
        "";

      setAccessCode(code);
      setVerifiedCourse(course);
      setStatus("success");

      sessionStorage.setItem(
        "cbtAccessCode",
        code
      );

      if (course) {
        sessionStorage.setItem(
          "cbtCourse",
          String(course)
        );
      }

      sessionStorage.removeItem(
        "cbtPaymentReference"
      );
      sessionStorage.removeItem(
        "cbtPaymentEmail"
      );
    } catch (err) {
      setStatus("failed");

      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify your payment. Please try again."
      );
    }
  }

  function updateField(
    field: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  async function handlePayment(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/cbt/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            course: form.course,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.authorization_url
      ) {
        throw new Error(
          data.message ||
            "Unable to initialize payment. Please try again."
        );
      }

      if (data.reference) {
        sessionStorage.setItem(
          "cbtPaymentReference",
          data.reference
        );
      }

      sessionStorage.setItem(
        "cbtPaymentEmail",
        form.email.trim()
      );

      sessionStorage.setItem(
        "cbtPaymentCourse",
        form.course
      );

      window.location.href =
        data.authorization_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  function continueToCBT() {
    sessionStorage.setItem(
      "cbtAccessCode",
      accessCode
    );

    if (verifiedCourse) {
      sessionStorage.setItem(
        "cbtCourse",
        String(verifiedCourse)
      );
    }

    window.location.href = "/cbt";
  }

  if (status === "verifying") {
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
          </div>
        </header>

        <section className="flex min-h-[75vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl border border-[#6B2638]/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#6B2638]/10">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#6B2638]/20 border-t-[#6B2638]" />
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Verifying Your Payment
            </h1>

            <p className="mt-4 leading-7 text-[#2B2022]/60">
              Please wait while we confirm your
              payment and prepare your CBT access.
            </p>

            <p className="mt-5 text-sm text-[#2B2022]/40">
              Do not close this page.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (status === "success") {
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
          </div>
        </header>

        <section className="flex min-h-[75vh] items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl rounded-3xl border border-[#6B2638]/10 bg-white p-8 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold md:text-4xl">
              Payment Successful
            </h1>

            <p className="mt-4 leading-7 text-[#2B2022]/60">
              Your CBT access has been activated.
              Keep your access code safe.
            </p>

            <div className="mt-8 rounded-2xl border border-[#6B2638]/10 bg-[#FAF7F2] p-6">
              <p className="text-sm font-medium text-[#2B2022]/50">
                YOUR CBT ACCESS CODE
              </p>

              <p className="mt-3 break-all text-3xl font-bold tracking-[0.15em] text-[#6B2638]">
                {accessCode}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#C89B5D]/20 bg-[#C89B5D]/5 p-5 text-left">
              <p className="text-sm font-semibold text-[#2B2022]">
                Important
              </p>

              <p className="mt-2 text-sm leading-6 text-[#2B2022]/60">
                Save this access code. You will use
                it whenever you want to access your
                CBT practice.
              </p>
            </div>

            <button
              type="button"
              onClick={continueToCBT}
              className="mt-8 w-full rounded-xl bg-[#6B2638] px-5 py-4 font-semibold text-white transition hover:bg-[#561E2D]"
            >
              Continue to CBT →
            </button>

            <Link
              href="/"
              className="mt-5 inline-block text-sm font-medium text-[#6B2638]"
            >
              Return to Homepage
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (status === "failed") {
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
          </div>
        </header>

        <section className="flex min-h-[75vh] items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">
              !
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Payment Verification Issue
            </h1>

            <p className="mt-4 leading-7 text-[#2B2022]/60">
              We could not confirm your payment
              automatically.
            </p>

            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-left text-sm leading-6 text-red-700">
              {error}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-xl bg-[#6B2638] px-5 py-3.5 font-semibold text-white transition hover:bg-[#561E2D]"
              >
                Try Again
              </button>

              <Link
                href="/cbt"
                className="rounded-xl border border-[#6B2638]/15 px-5 py-3.5 font-semibold text-[#6B2638]"
              >
                Go to CBT
              </Link>
            </div>

            <p className="mt-6 text-xs leading-5 text-[#2B2022]/40">
              If your account was charged, please do
              not make another payment immediately.
              Contact support so the transaction can
              be checked.
            </p>
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

          <Link
            href="/cbt"
            className="text-sm font-medium text-[#2B2022]/60 hover:text-[#6B2638]"
          >
            ← Back to CBT
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#6B2638]/8 px-4 py-2 text-sm font-semibold text-[#6B2638]">
              CBT Access
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Get Your CBT Access
            </h1>

            <p className="mt-5 leading-8 text-[#2B2022]/60">
              Get lifetime access to your selected
              CBT practice course for just ₦500.
            </p>

            <div className="mt-8 rounded-3xl border border-[#6B2638]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2B2022]/60">
                  CBT Access
                </span>

                <span className="text-2xl font-bold text-[#6B2638]">
                  ₦500
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-[#2B2022]/60">
                <p>✓ Lifetime CBT access</p>
                <p>
                  ✓ Practice your selected course
                </p>
                <p>✓ Timed examination experience</p>
                <p>
                  ✓ Instant result and answer review
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#6B2638]/10 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Enter Your Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#2B2022]/50">
              Your access code will be generated
              after successful payment.
            </p>

            <form
              onSubmit={handlePayment}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-semibold"
                >
                  Full Name
                </label>

                <input
                  id="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    updateField(
                      "full_name",
                      e.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="08012345678"
                  className="mt-2 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-semibold"
                >
                  Select Course
                </label>

                <select
                  id="course"
                  value={form.course}
                  onChange={(e) =>
                    updateField(
                      "course",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#6B2638]/15 bg-[#FAF7F2] px-4 py-3.5 outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#6B2638]/10"
                >
                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#6B2638] px-5 py-4 font-semibold text-white transition hover:bg-[#561E2D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Connecting to Paystack..."
                  : "Pay ₦500 & Get Access"}
              </button>

              <p className="text-center text-xs leading-5 text-[#2B2022]/45">
                You will be securely redirected to
                Paystack to complete your payment.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}