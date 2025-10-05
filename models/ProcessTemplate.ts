import mongoose, { Schema, model, models } from "mongoose";

export interface IActivity {
  name: string;
  description: string;
  deliverables: string[];
  standardReferences: {
    standardName: string;
    sectionId: string;
    sectionTitle: string;
  }[];
}

export interface IPhase {
  name: string;
  description: string;
  activities: IActivity[];
}

export interface IProcessTemplate {
  _id?: string;
  name: string;
  description: string;
  projectType: string; // e.g., "Software Development", "Construction", "Research"
  projectSize: string; // e.g., "Small", "Medium", "Large"
  complexity: string; // e.g., "Low", "Medium", "High"
  industry: string;
  phases: IPhase[];
  tailoringGuidance: string[];
  basedOnStandards: string[]; // Which standards this template is based on
  createdAt?: Date;
  updatedAt?: Date;
}

const StandardReferenceSchema = new Schema(
  {
    standardName: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    sectionTitle: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ActivitySchema = new Schema<IActivity>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deliverables: [
      {
        type: String,
      },
    ],
    standardReferences: [StandardReferenceSchema],
  },
  { _id: false }
);

const PhaseSchema = new Schema<IPhase>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    activities: [ActivitySchema],
  },
  { _id: false }
);

const ProcessTemplateSchema = new Schema<IProcessTemplate>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
      index: true,
    },
    projectSize: {
      type: String,
      required: true,
      enum: ["Small", "Medium", "Large"],
    },
    complexity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    industry: {
      type: String,
      required: true,
      index: true,
    },
    phases: [PhaseSchema],
    tailoringGuidance: [
      {
        type: String,
      },
    ],
    basedOnStandards: [
      {
        type: String,
        enum: ["PMBOK", "PRINCE2", "ISO21500", "ISO21502", "PROCESS_GROUPS"],
      },
    ],
  },
  { timestamps: true }
);

ProcessTemplateSchema.index({
  projectType: 1,
  projectSize: 1,
  complexity: 1,
  industry: 1,
});

export default models.ProcessTemplate ||
  model<IProcessTemplate>("ProcessTemplate", ProcessTemplateSchema);
