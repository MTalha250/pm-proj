import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Standard from "@/models/Standard";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const standard = await Standard.findById(id);

    if (!standard) {
      return NextResponse.json(
        { success: false, error: "Standard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: standard });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const standard = await Standard.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!standard) {
      return NextResponse.json(
        { success: false, error: "Standard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: standard });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const standard = await Standard.findByIdAndDelete(id);

    if (!standard) {
      return NextResponse.json(
        { success: false, error: "Standard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
