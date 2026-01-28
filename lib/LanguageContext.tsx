"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    nav_home: "Home",
    nav_emergency: "Report Emergency",
    nav_breakdown: "Report Breakdown",
    nav_contact: "Contact",

    // Home page
    home_title: "Emergency and Breakdown Alerts",
    btn_emergency: "Emergency",
    btn_breakdown: "Breakdown",
    recent_events: "Report Table",
    th_no: "No.",
    th_timestamp: "Timestamp",
    th_event: "Event",
    th_type: "Type",
    th_email: "Email",
    th_status: "Status",
    status_success: "Success",
    status_in_process: "In Process",
    status_failed: "Failed",
    no_events: "No events found",

    // Event names
    event_fire_alarm: "Fire alarm triggered",
    event_equipment_malfunction: "Equipment malfunction",
    event_power_outage: "Power outage",

    // Event types
    event_type_emergency: "Emergency",
    event_type_breakdown: "Breakdown",

    // Emergency page
    emergency_title: "Report Emergency",
    emergency_floor_label: "Floor",
    emergency_desc_label: "Description",
    emergency_desc_placeholder: "Please describe the emergency situation...",
    emergency_email_label: "Reporter Email",
    emergency_contact: "Emergency Contact Numbers",

    // Breakdown page
    breakdown_title: "Report Breakdown",
    breakdown_type_label: "Breakdown Type",
    breakdown_floor_label: "Floor",
    breakdown_desc_label: "Description",
    breakdown_desc_placeholder: "Please describe the breakdown issue...",
    breakdown_email_label: "Reporter Email",
    breakdown_photo_label: "Photo (Optional)",
    breakdown_photo_hint: "Upload a photo of the issue if available",

    // Breakdown types
    select_type: "-- Select Type --",
    type_electricity: "Electrical System",
    type_plumbing: "Plumbing",
    type_ac: "Air Conditioning",
    type_elevator: "Elevator",
    type_internet: "Internet/Network",
    type_equipment: "Equipment",
    type_other: "Other",
    other_type_label: "Please Specify",
    other_type_placeholder: "Enter breakdown type...",

    // Common form
    select_floor: "-- Select Floor --",
    floor: "Floor",
    btn_submit: "Submit",
    submitting: "Submitting...",
    submit_success: "Submitted successfully!",
    submit_error: "Submission failed. Please try again.",

    // Contact page
    contact_title: "Contact Us",

    // Footer
    footer_contact: "Contact",
    footer_name: "Prapawit",
  },
  th: {
    // Navbar
    nav_home: "หน้าหลัก",
    nav_emergency: "แจ้งเหตุฉุกเฉิน",
    nav_breakdown: "แจ้งเหตุขัดข้อง",
    nav_contact: "ติดต่อเรา",

    // Home page
    home_title: "ระบบแจ้งเหตุฉุกเฉินและเหตุขัดข้อง",
    btn_emergency: "เหตุฉุกเฉิน",
    btn_breakdown: "เหตุขัดข้อง",
    recent_events: "ตารางแจ้งเหตุ",
    th_no: "ลำดับ",
    th_timestamp: "เวลา",
    th_event: "เหตุการณ์",
    th_type: "ประเภท",
    th_email: "อีเมล",
    th_status: "สถานะ",
    status_success: "สำเร็จ",
    status_in_process: "กำลังดำเนินการ",
    status_failed: "ล้มเหลว",
    no_events: "ไม่พบเหตุการณ์",

    // Event names
    event_fire_alarm: "สัญญาณเตือนไฟไหม้ดังขึ้น",
    event_equipment_malfunction: "อุปกรณ์ทำงานผิดปกติ",
    event_power_outage: "ไฟฟ้าดับ",

    // Event types
    event_type_emergency: "เหตุฉุกเฉิน",
    event_type_breakdown: "เหตุขัดข้อง",

    // Emergency page
    emergency_title: "แจ้งเหตุฉุกเฉิน",
    emergency_floor_label: "ชั้น",
    emergency_desc_label: "รายละเอียด",
    emergency_desc_placeholder: "กรุณาอธิบายสถานการณ์ฉุกเฉิน...",
    emergency_email_label: "อีเมลผู้แจ้ง",
    emergency_contact: "เบอร์โทรฉุกเฉิน",

    // Breakdown page
    breakdown_title: "แจ้งเหตุขัดข้อง",
    breakdown_type_label: "ประเภทเหตุขัดข้อง",
    breakdown_floor_label: "ชั้น",
    breakdown_desc_label: "รายละเอียด",
    breakdown_desc_placeholder: "กรุณาอธิบายปัญหาที่พบ...",
    breakdown_email_label: "อีเมลผู้แจ้ง",
    breakdown_photo_label: "รูปภาพ (ไม่บังคับ)",
    breakdown_photo_hint: "อัปโหลดรูปภาพของปัญหาถ้ามี",

    // Breakdown types
    select_type: "-- เลือกประเภท --",
    type_electricity: "ระบบไฟฟ้า",
    type_plumbing: "ระบบประปา",
    type_ac: "ระบบปรับอากาศ",
    type_elevator: "ลิฟต์",
    type_internet: "อินเทอร์เน็ต/เครือข่าย",
    type_equipment: "อุปกรณ์",
    type_other: "อื่นๆ",
    other_type_label: "กรุณาระบุ",
    other_type_placeholder: "ระบุประเภทเหตุขัดข้อง...",

    // Common form
    select_floor: "-- เลือกชั้น --",
    floor: "ชั้น",
    btn_submit: "ส่งข้อมูล",
    submitting: "กำลังส่ง...",
    submit_success: "ส่งข้อมูลสำเร็จ!",
    submit_error: "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",

    // Contact page
    contact_title: "ติดต่อเรา",

    // Footer
    footer_contact: "ติดต่อ",
    footer_name: "ประภวิษณุ์",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "th")) {
      setLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language);
    }
  }, [language, mounted]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
