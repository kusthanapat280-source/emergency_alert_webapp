import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const hashBuffer = Buffer.from(hash, "hex");
    const derived = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuffer, derived);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Hardcoded superadmin
    if (username === "admin" && password === "admin1234") {
      return NextResponse.json({ success: true });
    }

    // Check admin_data table by email
    const { data, error } = await supabase
      .from("admin_data")
      .select("password")
      .eq("email", username)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false });
    }

    const match = verifyPassword(password, data.password);
    return NextResponse.json({ success: match });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false });
  }
}
