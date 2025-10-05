import mongoose, { Schema, model, models } from "mongoose";

export interface IBookmark {
  _id?: string;
  sessionId: string; // Browser session ID (no auth)
  standardId: string;
  sectionId: string;
  sectionTitle: string;
  pageNumber?: number;
  note?: string;
  createdAt?: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    standardId: {
      type: String,
      required: true,
      ref: "Standard",
    },
    sectionId: {
      type: String,
      required: true,
      ref: "Section",
    },
    sectionTitle: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

BookmarkSchema.index({ sessionId: 1, standardId: 1 });

export default models.Bookmark || model<IBookmark>("Bookmark", BookmarkSchema);
