"use client";

import { useEffect, useState } from "react";
import { Comparison } from "@/lib/types";
import { FiExternalLink, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

export default function ComparePage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [selectedComparison, setSelectedComparison] =
    useState<Comparison | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, []);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(comparisons.map((c) => c.category))];
    setCategories(uniqueCategories);
  }, [comparisons]);

  const fetchComparisons = async () => {
    try {
      const res = await fetch("/api/comparisons");
      const data = await res.json();
      if (data.success) {
        setComparisons(data.data);
      }
    } catch (error) {
      console.error("Error fetching comparisons:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComparisons =
    selectedCategory === "all"
      ? comparisons
      : comparisons.filter((c) => c.category === selectedCategory);

  const standardColors: { [key: string]: string } = {
    PMBOK: "bg-blue-100 text-blue-800 border-blue-300",
    PRINCE2: "bg-purple-100 text-purple-800 border-purple-300",
    ISO21500: "bg-green-100 text-green-800 border-green-300",
    ISO21502: "bg-teal-100 text-teal-800 border-teal-300",
    PROCESS_GROUPS: "bg-orange-100 text-orange-800 border-orange-300",
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Compare Standards
      </h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 flex items-center justify-between group ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span>All Topics</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === "all"
                  ? "bg-white/20"
                  : "bg-gray-200 group-hover:bg-gray-300"
              }`}>
                {comparisons.length}
              </span>
            </button>
            {categories.map((category) => {
              const count = comparisons.filter(c => c.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 flex items-center justify-between group ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category
                      ? "bg-white/20"
                      : "bg-gray-200 group-hover:bg-gray-300"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedComparison ? (
            <div>
              <button
                onClick={() => setSelectedComparison(null)}
                className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
              >
                ← Back to list
              </button>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-3">
                    {selectedComparison.category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedComparison.topic}
                  </h2>
                  {selectedComparison.description && (
                    <p className="text-gray-600">
                      {selectedComparison.description}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    How Each Standard Addresses This Topic
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedComparison.standards.map((std, idx) => (
                      <div
                        key={idx}
                        className={`border-2 rounded-lg p-4 ${
                          standardColors[std.standardName] || "bg-gray-100"
                        }`}
                      >
                        <h4 className="font-bold text-lg mb-2">
                          {std.standardName}
                        </h4>
                        <p className="text-sm mb-2 font-semibold">
                          {std.sectionTitle}
                        </p>
                        {std.pageNumber && (
                          <p className="text-xs mb-2">Page {std.pageNumber}</p>
                        )}
                        <p className="text-sm mb-3">{std.excerpt}</p>
                        <Link
                          href={`/repository?sectionId=${std.sectionId}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                        >
                          View in Repository <FiExternalLink />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedComparison.similarities.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Similarities Across Standards
                    </h3>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedComparison.similarities.map((sim, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>{sim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedComparison.differences.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Key Differences
                    </h3>
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedComparison.differences.map((diff, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">⚠</span>
                            <span>{diff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedComparison.uniquePoints.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Unique Aspects by Standard
                    </h3>
                    <div className="space-y-4">
                      {selectedComparison.uniquePoints.map((unique, idx) => (
                        <div
                          key={idx}
                          className={`border-2 rounded-lg p-4 ${
                            standardColors[unique.standardName] || "bg-gray-100"
                          }`}
                        >
                          <h4 className="font-bold text-lg mb-2">
                            {unique.standardName}
                          </h4>
                          <ul className="space-y-2">
                            {unique.points.map((point, pidx) => (
                              <li key={pidx} className="flex items-start gap-2">
                                <span className="font-bold">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {filteredComparisons.length > 0 ? (
                <div className="space-y-4">
                  {filteredComparisons.map((comparison) => (
                    <button
                      key={comparison._id}
                      onClick={() => setSelectedComparison(comparison)}
                      className="w-full text-left bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-2">
                            {comparison.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {comparison.topic}
                          </h3>
                          {comparison.description && (
                            <p className="text-gray-600 mb-3">
                              {comparison.description}
                            </p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            {comparison.standards.map((std, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  standardColors[std.standardName] ||
                                  "bg-gray-200"
                                }`}
                              >
                                {std.standardName}
                              </span>
                            ))}
                          </div>
                        </div>
                        <FiChevronRight className="text-2xl text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    No Comparisons Available
                  </h2>
                  <p className="text-gray-600 mb-4">
                    There are no comparisons in the selected category yet.
                  </p>
                  <p className="text-gray-500 text-sm">
                    The database is being populated with comprehensive comparisons
                    across all PM standards.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
