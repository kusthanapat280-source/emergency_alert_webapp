"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

export default function BreakdownPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    event_type: "",
    other_type: "",
    floor: "",
    description: "",
    reporter_email: "",
    photo: null as File | null,
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("event_type", formData.event_type === "other" ? formData.other_type : formData.event_type);
      formDataToSend.append("floor", formData.floor);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("reporter_email", formData.reporter_email);
      if (formData.photo) formDataToSend.append("photo", formData.photo);

      const response = await fetch("/api/submit_breakdown", { method: "POST", body: formDataToSend });

      if (response.ok) {
        setMessage({ type: "success", text: t("submit_success") || "Submitted successfully!" });
        setFormData({ event_type: "", other_type: "", floor: "", description: "", reporter_email: "", photo: null });
      } else {
        setMessage({ type: "error", text: t("submit_error") || "Submission failed. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: t("submit_error") || "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Relative wrapper so the image can span header → form */}
      <div className="relative">

        {/* Dark Header */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-10 px-4">
          <div className="container mx-auto">
            {/* Mobile: image centered at top */}
            <div className="flex justify-center mb-4 md:hidden">
              <Image
                src="/breakdown_dog.png"
                alt="Breakdown"
                width={100}
                height={100}
                className="object-contain drop-shadow-xl"
              />
            </div>
            {/* Title — shifted right on desktop */}
            <div className="text-center md:pl-44 lg:pl-52">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-3">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white animate-fadeInUp">
                {t("breakdown_title")}
              </h2>
            </div>
          </div>
        </div>

        {/* Desktop image — absolutely positioned, overlapping header + form */}
        <div className="hidden md:block absolute left-4 lg:left-10 top-4 z-20 pointer-events-none select-none">
          <Image
            src="/breakdown_dog.png"
            alt="Breakdown"
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
                <div className={`mb-5 p-4 rounded-xl flex items-start justify-between gap-3 animate-fadeIn ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                  <button onClick={() => setMessage(null)} className="text-lg leading-none opacity-60 hover:opacity-100 shrink-0">&times;</button>
                </div>
              )}

              {/* Form Card */}
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeInUp">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4">
                    <h3 className="text-white font-semibold text-sm tracking-wide">กรอกข้อมูลเหตุขัดข้อง · Breakdown Details</h3>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <div>
                      <label htmlFor="event_type" className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("breakdown_type_label")} <span className="text-red-500">*</span>
                      </label>
                      <select className={inputCls} id="event_type" name="event_type" value={formData.event_type} onChange={handleChange} required>
                        <option value="">{t("select_type")}</option>
                        <option value={t("type_electricity")}>{t("type_electricity")}</option>
                        <option value={t("type_plumbing")}>{t("type_plumbing")}</option>
                        <option value={t("type_ac")}>{t("type_ac")}</option>
                        <option value={t("type_elevator")}>{t("type_elevator")}</option>
                        <option value={t("type_internet")}>{t("type_internet")}</option>
                        <option value={t("type_equipment")}>{t("type_equipment")}</option>
                        <option value="other">{t("type_other")}</option>
                      </select>
                    </div>

                    {formData.event_type === "other" && (
                      <div className="animate-fadeIn">
                        <label htmlFor="other_type" className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t("other_type_label")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text" className={inputCls} id="other_type" name="other_type"
                          placeholder={t("other_type_placeholder")} value={formData.other_type} onChange={handleChange} required
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="floor" className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("breakdown_floor_label")} <span className="text-red-500">*</span>
                      </label>
                      <select className={inputCls} id="floor" name="floor" value={formData.floor} onChange={handleChange} required>
                        <option value="">{t("select_floor")}</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((i) => (
                          <option key={i} value={`${t("floor")} ${i}`}>{t("floor")} {i}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("breakdown_desc_label")} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={inputCls} id="description" name="description"
                        rows={4} placeholder={t("breakdown_desc_placeholder")}
                        value={formData.description} onChange={handleChange} required
                      />
                    </div>

                    <div>
                      <label htmlFor="reporter_email" className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("breakdown_email_label")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email" className={inputCls} id="reporter_email" name="reporter_email"
                        placeholder="example@email.com" value={formData.reporter_email} onChange={handleChange} required
                      />
                    </div>

                    <div>
                      <label htmlFor="photo" className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("breakdown_photo_label")}
                      </label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-colors duration-200">
                        <input
                          type="file" id="photo" name="photo" accept="image/*"
                          onChange={handleFileChange}
                          className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer cursor-pointer"
                        />
                        <p className="text-xs text-slate-400 mt-2">{t("breakdown_photo_hint")}</p>
                      </div>
                    </div>

                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-smooth" />{t("submitting")}</>
                      ) : t("btn_submit")}
                    </button>
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
