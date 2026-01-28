"use client";

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
      // Replace with actual API endpoint
      const response = await fetch("/api/submit_emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (error) {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 mb-16 pb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t("emergency_title")}
        </h2>

        {/* Flash Messages */}
        {message && (
          <div
            className={`max-w-2xl mx-auto mb-4 p-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : message.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="text-xl font-bold ml-4 hover:opacity-70"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8"
        >
          {/* Floor Selection */}
          <div className="mb-4">
            <label
              htmlFor="floor"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("emergency_floor_label")}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              required
            >
              <option value="">{t("select_floor")}</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((i) => (
                <option key={i} value={`${t("floor")} ${i}`}>
                  {t("floor")} {i}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("emergency_desc_label")}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
              id="description"
              name="description"
              rows={4}
              placeholder={t("emergency_desc_placeholder")}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="reporter_email"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("emergency_email_label")}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
              id="reporter_email"
              name="reporter_email"
              placeholder="example@email.com"
              value={formData.reporter_email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-16 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("submitting") || "Submitting..."
                : t("btn_submit")}
            </button>
          </div>

          {/* Emergency Contact Info */}
          <div className="mb-2 p-4 bg-gray-100 rounded">
            <h5 className="text-center text-red-600 font-semibold mb-2">
              {t("emergency_contact")}
            </h5>
            <p className="text-center mb-0 text-black">
              <strong>Baitan:</strong> 081-258-3826 | <strong>On:</strong>{" "}
              087-852-6457
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
