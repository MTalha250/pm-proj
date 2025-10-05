import { create } from "zustand";
import { Standard, Section, Bookmark } from "@/lib/types";

interface AppState {
  standards: Standard[];
  selectedStandard: Standard | null;
  sections: Section[];
  bookmarks: Bookmark[];
  selectedSection: Section | null;
  searchQuery: string;
  setStandards: (standards: Standard[]) => void;
  setSelectedStandard: (standard: Standard | null) => void;
  setSections: (sections: Section[]) => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  setSelectedSection: (section: Section | null) => void;
  setSearchQuery: (query: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (bookmarkId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  standards: [],
  selectedStandard: null,
  sections: [],
  bookmarks: [],
  selectedSection: null,
  searchQuery: "",
  setStandards: (standards) => set({ standards }),
  setSelectedStandard: (standard) => set({ selectedStandard: standard }),
  setSections: (sections) => set({ sections }),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  setSelectedSection: (section) => set({ selectedSection: section }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addBookmark: (bookmark) =>
    set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
  removeBookmark: (bookmarkId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b._id !== bookmarkId),
    })),
}));
