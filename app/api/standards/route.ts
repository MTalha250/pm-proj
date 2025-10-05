import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Standard from "@/models/Standard";

export async function GET() {
  try {
    await dbConnect();
    const standards = await Standard.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: standards });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const standard = await Standard.create(body);
    return NextResponse.json(
      { success: true, data: standard },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
