"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

export default function EmergencyPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    floor: "",
    description: "",
    reporter_email: "",
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/submit_emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: t("submit_success") || "Submitted successfully!",
        });
        setFormData({ floor: "", description: "", reporter_email: "" });
      } else {
        setMessage({
          type: "error",
          text: t("submit_error") || "Submission failed. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: t("submit_error") || "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputCls =
    "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 transition-all duration-200";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Relative wrapper so the image can span header → form */}
      <div className="relative">
        {/* Dark Header */}
        <div className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 py-10 px-4">
          <div className="container mx-auto">
            {/* Mobile: image centered at top */}
            <div className="flex justify-center mb-4 md:hidden">
              <Image
                src="/emergency_cat.png"
                alt="Emergency"
                width={100}
                height={100}
                className="object-contain drop-shadow-xl"
              />
            </div>
            {/* Title — shifted right on desktop to make room for image */}
            <div className="text-center md:pl-44 lg:pl-52">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 mb-3">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white animate-fadeInUp">
                {t("emergency_title")}
              </h2>
            </div>
          </div>
        </div>

        {/* Desktop image — absolutely positioned, overlapping header + form */}
        <div className="hidden md:block absolute left-4 lg:left-10 top-4 z-20 pointer-events-none select-none">
          <Image
            src="/emergency_cat.png"
            alt="Emergency"
            width={160}
            height={240}
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Content area */}
        <div className="container mx-auto px-4 py-6 sm:py-8 mb-16">
          <div className="flex gap-4 lg:gap-6 items-start">
            {/* Spacer matching image column — desktop only */}
            <div className="hidden md:block w-44 lg:w-52 shrink-0" />

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Flash Message */}
              {message && (
                <div
                  className={`mb-5 p-4 rounded-xl flex items-start justify-between gap-3 animate-fadeIn ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <svg
                        className="w-5 h-5 text-emerald-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                  <button
                    onClick={() => setMessage(null)}
                    className="text-lg leading-none opacity-60 hover:opacity-100 shrink-0"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Form card */}
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeInUp">
                  <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                    <h3 className="text-white font-semibold text-sm tracking-wide">
                      กรอกข้อมูลเหตุฉุกเฉิน · Emergency Details
                    </h3>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <div>
                      <label
                        htmlFor="floor"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        {t("emergency_floor_label")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={inputCls}
                        id="floor"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t("select_floor")}</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (i) => (
                            <option key={i} value={`${t("floor")} ${i}`}>
                              {t("floor")} {i}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        {t("emergency_desc_label")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={inputCls}
                        id="description"
                        name="description"
                        rows={4}
                        placeholder={t("emergency_desc_placeholder")}
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reporter_email"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        {t("emergency_email_label")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        id="reporter_email"
                        name="reporter_email"
                        placeholder="example@email.com"
                        value={formData.reporter_email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-smooth" />
                          {t("submitting")}
                        </>
                      ) : (
                        t("btn_submit")
                      )}
                    </button>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-red-600 text-center uppercase tracking-wide mb-2">
                        {t("emergency_contact")}
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-slate-700">
                        <span>
                          <strong className="text-slate-800">Baitan:</strong>{" "}
                          <a
                            href="tel:0812583826"
                            className="text-red-600 hover:underline"
                          >
                            081-258-3826
                          </a>
                        </span>
                        <span className="hidden sm:inline text-slate-300">
                          |
                        </span>
                        <span>
                          <strong className="text-slate-800">On:</strong>{" "}
                          <a
                            href="tel:0878526457"
                            className="text-red-600 hover:underline"
                          >
                            087-852-6457
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
