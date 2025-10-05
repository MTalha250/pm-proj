import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ProcessTemplate from "@/models/ProcessTemplate";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { projectType, projectSize, complexity, industry } = body;

    // Find matching process templates
    const templates = await ProcessTemplate.find({
      projectType,
      projectSize,
      complexity,
      industry,
    });

    if (templates.length === 0) {
      // Find closest match
      const closestMatch = await ProcessTemplate.findOne({
        $or: [
          { projectType, projectSize, complexity },
          { projectType, projectSize, industry },
          { projectType, complexity, industry },
          { projectType },
        ],
      });

      return NextResponse.json({
        success: true,
        data: closestMatch,
        message: "No exact match found. Showing closest match.",
      });
    }

    return NextResponse.json({ success: true, data: templates[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
