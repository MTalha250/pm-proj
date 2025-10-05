import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comparison from "@/models/Comparison";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query: any = {};
    if (category) {
      query.category = category;
    }

    const comparisons = await Comparison.find(query).sort({ topic: 1 });
    return NextResponse.json({ success: true, data: comparisons });
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
    const comparison = await Comparison.create(body);
    return NextResponse.json(
      { success: true, data: comparison },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
