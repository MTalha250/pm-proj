import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ProcessTemplate from "@/models/ProcessTemplate";

export async function GET() {
  try {
    await dbConnect();
    const templates = await ProcessTemplate.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: templates });
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
    const template = await ProcessTemplate.create(body);
    return NextResponse.json(
      { success: true, data: template },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
