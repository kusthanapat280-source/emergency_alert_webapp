import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const breakdown_type = formData.get("event_type") as string;
    const floor = formData.get("floor") as string;
    const description = formData.get("description") as string;
    const reporter_email = formData.get("reporter_email") as string;

    if (!breakdown_type || !floor || !description || !reporter_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("breakdown_data").insert({
      breakdown_type,
      floor,
      description,
      email: reporter_email,
      status: "Waiting",
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
