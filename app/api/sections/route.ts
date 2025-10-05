import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Section from "@/models/Section";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const standardId = searchParams.get("standardId");
    const search = searchParams.get("search");
    const level = searchParams.get("level");

    let query: any = {};

    if (standardId) {
      query.standardId = standardId;
    }

    if (level) {
      query.level = parseInt(level);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sections = await Section.find(query).sort({
      chapterNumber: 1,
      sectionNumber: 1,
    });
    return NextResponse.json({ success: true, data: sections });
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
    const section = await Section.create(body);
    return NextResponse.json({ success: true, data: section }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
