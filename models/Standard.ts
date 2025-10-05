import mongoose, { Schema, model, models } from "mongoose";

export interface IStandard {
  _id?: string;
  name: string;
  fullName: string;
  version: string;
  description: string;
  fileName: string;
  fileType: "pdf" | "epub";
  totalPages?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const StandardSchema = new Schema<IStandard>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["PMBOK", "PRINCE2", "ISO21500", "ISO21502", "PROCESS_GROUPS"],
    },
    fullName: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "epub"],
      required: true,
    },
    totalPages: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default models.Standard || model<IStandard>("Standard", StandardSchema);
