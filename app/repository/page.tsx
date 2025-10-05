"use client";

import { useEffect, useState } from "react";
import { Standard, Section, Bookmark } from "@/lib/types";
import { getSessionId } from "@/lib/session";
import {
  FiSearch,
  FiBookmark,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

export default function RepositoryPage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(
    null
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    fetchStandards();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (selectedStandard) {
      fetchSections(selectedStandard._id);
    }
  }, [selectedStandard]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  }, [searchQuery, sections]);

  const fetchStandards = async () => {
    try {
      const res = await fetch("/api/standards");
      const data = await res.json();
      if (data.success) {
        setStandards(data.data);
      }
    } catch (error) {
      console.error("Error fetching standards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (standardId: string) => {
    try {
      const res = await fetch(`/api/sections?standardId=${standardId}`);
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
        setFilteredSections(data.data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const sessionId = getSessionId();
      const res = await fetch(`/api/bookmarks?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setBookmarks(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const addBookmark = async (section: Section) => {
    try {
      const sessionId = getSessionId();
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          standardId: section.standardId,
          sectionId: section._id,
          sectionTitle: section.title,
          pageNumber: section.pageNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookmarks([...bookmarks, data.data]);
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      await fetch(`/api/bookmarks?id=${bookmarkId}`, { method: "DELETE" });
      setBookmarks(bookmarks.filter((b) => b._id !== bookmarkId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const isBookmarked = (sectionId: string) => {
    return bookmarks.some((b) => b.sectionId === sectionId);
  };

  const toggleChapter = (chapterNumber: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterNumber)) {
      newExpanded.delete(chapterNumber);
    } else {
      newExpanded.add(chapterNumber);
    }
    setExpandedChapters(newExpanded);
  };

  const groupByChapter = (sections: Section[]) => {
    const chapters: { [key: number]: Section[] } = {};
    sections.forEach((section) => {
      const chapter = section.chapterNumber || 0;
      if (!chapters[chapter]) {
        chapters[chapter] = [];
      }
      chapters[chapter].push(section);
    });
    return chapters;
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const chapters = groupByChapter(filteredSections);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Standards Repository
      </h1>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Standards</h2>
            {standards.map((standard) => (
              <button
                key={standard._id}
                onClick={() => {
                  setSelectedStandard(standard);
                  setSelectedSection(null);
                }}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                  selectedStandard?._id === standard._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="font-semibold">{standard.name}</div>
                <div className="text-xs opacity-80">{standard.version}</div>
              </button>
            ))}

            {bookmarks.length > 0 && (
              <>
                <h3 className="text-lg font-bold mt-6 mb-3">Bookmarks</h3>
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark._id}
                    className="p-2 bg-yellow-50 rounded mb-2 text-sm"
                  >
                    <div className="font-semibold">{bookmark.sectionTitle}</div>
                    <button
                      onClick={() => removeBookmark(bookmark._id)}
                      className="text-red-600 text-xs hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-9">
          {selectedStandard ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search within this standard..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-bold mb-4">Contents</h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {Object.keys(chapters)
                        .sort((a, b) => parseInt(a) - parseInt(b))
                        .map((chapterKey) => {
                          const chapterNum = parseInt(chapterKey);
                          const chapterSections = chapters[chapterNum];
                          const mainSection = chapterSections.find(
                            (s) => s.level === 1
                          );

                          return (
                            <div key={chapterNum}>
                              <button
                                onClick={() => {
                                  toggleChapter(chapterNum);
                                  // If there's a main section, select it when clicking the chapter
                                  if (mainSection) {
                                    setSelectedSection(mainSection);
                                  }
                                }}
                                className={`w-full text-left p-2 hover:bg-gray-100 rounded flex items-center justify-between ${
                                  selectedSection?._id === mainSection?._id
                                    ? "bg-blue-50 text-blue-700"
                                    : ""
                                }`}
                              >
                                <span className="font-semibold text-sm">
                                  {mainSection?.title ||
                                    `Chapter ${chapterNum}`}
                                </span>
                                {expandedChapters.has(chapterNum) ? (
                                  <FiChevronDown />
                                ) : (
                                  <FiChevronRight />
                                )}
                              </button>

                              {expandedChapters.has(chapterNum) &&
                                chapterSections.length > 1 && (
                                  <div className="ml-4 space-y-1">
                                    {chapterSections
                                      .filter((s) => s._id !== mainSection?._id)
                                      .map((section) => (
                                        <button
                                          key={section._id}
                                          onClick={() =>
                                            setSelectedSection(section)
                                          }
                                          className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                                            selectedSection?._id === section._id
                                              ? "bg-blue-50 text-blue-700"
                                              : ""
                                          }`}
                                        >
                                          {section.sectionNumber && (
                                            <span className="text-gray-500 mr-2">
                                              {section.sectionNumber}
                                            </span>
                                          )}
                                          {section.title}
                                        </button>
                                      ))}
                                  </div>
                                )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {selectedSection ? (
                    <div className="bg-white rounded-lg shadow-md p-8 overflow-hidden">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedSection.title}
                          </h2>
                          {selectedSection.sectionNumber && (
                            <p className="text-gray-500">
                              Section {selectedSection.sectionNumber}
                            </p>
                          )}
                          {selectedSection.pageNumber && (
                            <p className="text-gray-500">
                              Page {selectedSection.pageNumber}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (isBookmarked(selectedSection._id)) {
                              const bookmark = bookmarks.find(
                                (b) => b.sectionId === selectedSection._id
                              );
                              if (bookmark) removeBookmark(bookmark._id);
                            } else {
                              addBookmark(selectedSection);
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isBookmarked(selectedSection._id)
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          <FiBookmark />
                        </button>
                      </div>

                      <div className="border-t-2 border-gray-200 pt-6 mt-6">
                        <div className="max-w-full overflow-x-auto">
                          <div className="space-y-3 break-words">
                            {selectedSection.content.split('\n').map((paragraph, idx) => {
                              const trimmed = paragraph.trim();
                              if (!trimmed) return <div key={idx} className="h-2" />;

                              if (trimmed.includes('…………') || trimmed.includes('.......') || /\.{3,}/.test(trimmed)) {
                                const parts = trimmed.split(/[.…]+/);
                                if (parts.length >= 2) {
                                  return (
                                    <div key={idx} className="flex justify-between items-center py-1 hover:bg-gray-50 px-2 rounded">
                                      <span className="text-gray-700 flex-shrink-0 pr-2">{parts[0].trim()}</span>
                                      <span className="border-b border-dotted border-gray-300 flex-grow mx-2"></span>
                                      <span className="text-gray-600 flex-shrink-0 pl-2">{parts[parts.length - 1].trim()}</span>
                                    </div>
                                  );
                                }
                              }

                              if (trimmed.startsWith('●') || trimmed.startsWith('•')) {
                                return (
                                  <div key={idx} className="flex items-start gap-3 ml-4">
                                    <span className="text-blue-600 font-bold mt-1">•</span>
                                    <p className="text-gray-700 leading-7 flex-1">
                                      {trimmed.substring(1).trim()}
                                    </p>
                                  </div>
                                );
                              }

                              if (trimmed.match(/^[A-Z\s]{10,}$/) || trimmed.match(/^[A-Z][A-Z\s]+$/)) {
                                return (
                                  <h3 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-blue-600 pb-2">
                                    {trimmed}
                                  </h3>
                                );
                              }

                              if (trimmed.match(/^(Chapter|Section|Part|Appendix|Table|Figure)\s+\d+/i)) {
                                return (
                                  <h4 key={idx} className="text-xl font-bold text-blue-700 mt-6 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-600 rounded"></span>
                                    {trimmed}
                                  </h4>
                                );
                              }

                              if (trimmed.match(/^(Definition|Note|Key|Important|Example):/i)) {
                                return (
                                  <div key={idx} className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4 rounded-r">
                                    <p className="text-gray-800 font-medium leading-7">
                                      {trimmed}
                                    </p>
                                  </div>
                                );
                              }

                              if (trimmed.length < 80 && trimmed.match(/^[A-Z][^.!?]*$/) && !trimmed.includes(',')) {
                                return (
                                  <h5 key={idx} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                                    {trimmed}
                                  </h5>
                                );
                              }

                              return (
                                <p key={idx} className="text-gray-700 leading-8 text-base break-words overflow-wrap-anywhere">
                                  {trimmed}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedStandard.fullName}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {selectedStandard.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Select a section from the table of contents to view its
                        content.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select a Standard
              </h2>
              <p className="text-gray-600">
                Choose a standard from the left sidebar to explore its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
