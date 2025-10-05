export interface Standard {
  _id: string;
  name: string;
  fullName: string;
  version: string;
  description: string;
  fileName: string;
  fileType: "pdf" | "epub";
  totalPages?: number;
}

export interface Section {
  _id: string;
  standardId: string;
  title: string;
  content: string;
  sectionNumber?: string;
  pageNumber?: number;
  chapterNumber?: number;
  level: number;
  parentSectionId?: string;
  keywords: string[];
}

export interface ComparisonPoint {
  standardName: string;
  sectionId: string;
  sectionTitle: string;
  excerpt: string;
  pageNumber?: number;
}

export interface Comparison {
  _id: string;
  topic: string;
  category: string;
  description: string;
  standards: ComparisonPoint[];
  similarities: string[];
  differences: string[];
  uniquePoints: {
    standardName: string;
    points: string[];
  }[];
}

export interface Bookmark {
  _id: string;
  sessionId: string;
  standardId: string;
  sectionId: string;
  sectionTitle: string;
  pageNumber?: number;
  note?: string;
  createdAt: Date;
}

export interface Activity {
  name: string;
  description: string;
  deliverables: string[];
  standardReferences: {
    standardName: string;
    sectionId: string;
    sectionTitle: string;
  }[];
}

export interface Phase {
  name: string;
  description: string;
  activities: Activity[];
}

export interface ProcessTemplate {
  _id: string;
  name: string;
  description: string;
  projectType: string;
  projectSize: string;
  complexity: string;
  industry: string;
  phases: Phase[];
  tailoringGuidance: string[];
  basedOnStandards: string[];
}
