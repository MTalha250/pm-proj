import mongoose, { Schema, model, models } from "mongoose";

export interface IComparisonPoint {
  standardName: string;
  sectionId: string;
  sectionTitle: string;
  excerpt: string;
  pageNumber?: number;
}

export interface IComparison {
  _id?: string;
  topic: string;
  category: string; // e.g., "Risk Management", "Stakeholder Engagement"
  description: string;
  standards: IComparisonPoint[];
  similarities: string[];
  differences: string[];
  uniquePoints: {
    standardName: string;
    points: string[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ComparisonPointSchema = new Schema<IComparisonPoint>(
  {
    standardName: {
      type: String,
      required: true,
      enum: ["PMBOK", "PRINCE2", "ISO21500", "ISO21502", "PROCESS_GROUPS"],
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
    excerpt: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
    },
  },
  { _id: false }
);

const UniquePointSchema = new Schema(
  {
    standardName: {
      type: String,
      required: true,
    },
    points: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const ComparisonSchema = new Schema<IComparison>(
  {
    topic: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    standards: [ComparisonPointSchema],
    similarities: [
      {
        type: String,
      },
    ],
    differences: [
      {
        type: String,
      },
    ],
    uniquePoints: [UniquePointSchema],
  },
  { timestamps: true }
);

export default models.Comparison ||
  model<IComparison>("Comparison", ComparisonSchema);
