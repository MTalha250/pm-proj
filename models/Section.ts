import mongoose, { Schema, model, models } from "mongoose";

export interface ISection {
  _id?: string;
  standardId: string;
  title: string;
  content: string;
  sectionNumber?: string;
  pageNumber?: number;
  chapterNumber?: number;
  level: number; // 1 for chapter, 2 for section, 3 for subsection
  parentSectionId?: string;
  keywords: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SectionSchema = new Schema<ISection>(
  {
    standardId: {
      type: String,
      required: true,
      ref: "Standard",
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      text: true, // Enable text search
    },
    sectionNumber: {
      type: String,
    },
    pageNumber: {
      type: Number,
    },
    chapterNumber: {
      type: Number,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    parentSectionId: {
      type: String,
      ref: "Section",
    },
    keywords: [
      {
        type: String,
        lowercase: true,
      },
    ],
  },
  { timestamps: true }
);

// Create text index for search
SectionSchema.index({ title: "text", content: "text", keywords: "text" });

export default models.Section || model<ISection>("Section", SectionSchema);
