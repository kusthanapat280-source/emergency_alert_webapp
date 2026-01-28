"use client";

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
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "event_type",
        formData.event_type === "other"
          ? formData.other_type
          : formData.event_type,
      );
      formDataToSend.append("floor", formData.floor);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("reporter_email", formData.reporter_email);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      // Replace with actual API endpoint
      const response = await fetch("/api/submit_breakdown", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: t("submit_success") || "Submitted successfully!",
        });
        setFormData({
          event_type: "",
          other_type: "",
          floor: "",
          description: "",
          reporter_email: "",
          photo: null,
        });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        photo: e.target.files[0],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 mb-16 pb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t("breakdown_title")}
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
          {/* Event Type Selection */}
          <div className="mb-4">
            <label
              htmlFor="event_type"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("breakdown_type_label")}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
              id="event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
            >
              <option value="">{t("select_type")}</option>
              <option value={t("type_electricity")}>
                {t("type_electricity")}
              </option>
              <option value={t("type_plumbing")}>{t("type_plumbing")}</option>
              <option value={t("type_ac")}>{t("type_ac")}</option>
              <option value={t("type_elevator")}>{t("type_elevator")}</option>
              <option value={t("type_internet")}>{t("type_internet")}</option>
              <option value={t("type_equipment")}>{t("type_equipment")}</option>
              <option value="other">{t("type_other")}</option>
            </select>
          </div>

          {/* Other Type Input */}
          {formData.event_type === "other" && (
            <div className="mb-4">
              <label
                htmlFor="other_type"
                className="block text-gray-700 font-medium mb-2"
              >
                {t("other_type_label")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                id="other_type"
                name="other_type"
                placeholder={t("other_type_placeholder")}
                value={formData.other_type}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Floor Selection */}
          <div className="mb-4">
            <label
              htmlFor="floor"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("breakdown_floor_label")}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
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
              {t("breakdown_desc_label")}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
              id="description"
              name="description"
              rows={4}
              placeholder={t("breakdown_desc_placeholder")}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="reporter_email"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("breakdown_email_label")}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
              id="reporter_email"
              name="reporter_email"
              placeholder="example@email.com"
              value={formData.reporter_email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label
              htmlFor="photo"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("breakdown_photo_label")}
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="text-sm text-gray-500 mt-1">
              {t("breakdown_photo_hint")}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white font-semibold py-3 px-16 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#45cf13" }}
              onMouseEnter={(e) =>
                !isSubmitting &&
                (e.currentTarget.style.backgroundColor = "#3db810")
              }
              onMouseLeave={(e) =>
                !isSubmitting &&
                (e.currentTarget.style.backgroundColor = "#45cf13")
              }
            >
              {isSubmitting
                ? t("submitting") || "Submitting..."
                : t("btn_submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
