"use client";

import { useEffect, useState } from "react";
import { Comparison } from "@/lib/types";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiBarChart2,
} from "react-icons/fi";

export default function InsightsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, []);

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

  // Calculate statistics
  const totalTopics = comparisons.length;
  const totalSimilarities = comparisons.reduce(
    (sum, c) => sum + c.similarities.length,
    0
  );
  const totalDifferences = comparisons.reduce(
    (sum, c) => sum + c.differences.length,
    0
  );
  const totalUniquePoints = comparisons.reduce(
    (sum, c) => sum + c.uniquePoints.reduce((s, u) => s + u.points.length, 0),
    0
  );

  // Group by category
  const categories = comparisons.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as { [key: string]: Comparison[] });

  // Count standard coverage
  const standardCoverage: { [key: string]: number } = {};
  comparisons.forEach((comp) => {
    comp.standards.forEach((std) => {
      standardCoverage[std.standardName] =
        (standardCoverage[std.standardName] || 0) + 1;
    });
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Insights Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive analysis of similarities, differences, and unique
          aspects across PM standards
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 font-semibold">Topics Compared</h3>
            <FiBarChart2 className="text-blue-600 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalTopics}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 font-semibold">Similarities Found</h3>
            <FiCheckCircle className="text-green-600 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalSimilarities}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 font-semibold">Key Differences</h3>
            <FiAlertCircle className="text-yellow-600 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalDifferences}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 font-semibold">Unique Points</h3>
            <FiStar className="text-purple-600 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalUniquePoints}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Standard Coverage
        </h2>
        <div className="space-y-4">
          {Object.entries(standardCoverage).map(([standard, count]) => {
            const percentage = (count / totalTopics) * 100;
            return (
              <div key={standard}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{standard}</span>
                  <span className="text-gray-600">
                    {count} / {totalTopics} topics ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Insights by Category
        </h2>
        <div className="space-y-6">
          {Object.entries(categories).map(([category, comps]) => {
            const catSimilarities = comps.reduce(
              (s, c) => s + c.similarities.length,
              0
            );
            const catDifferences = comps.reduce(
              (s, c) => s + c.differences.length,
              0
            );
            const catUnique = comps.reduce(
              (s, c) =>
                s + c.uniquePoints.reduce((u, p) => u + p.points.length, 0),
              0
            );

            return (
              <div key={category} className="border-b pb-6 last:border-b-0">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {category}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheckCircle className="text-green-600" />
                      <span className="font-semibold text-green-800">
                        Similarities
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {catSimilarities}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiAlertCircle className="text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Differences
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">
                      {catDifferences}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiStar className="text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Unique Points
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {catUnique}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Common Practices Across Standards
          </h2>
          <div className="space-y-4">
            {comparisons
              .filter((c) => c.similarities.length > 0)
              .slice(0, 5)
              .map((comp) => (
                <div
                  key={comp._id}
                  className="border-l-4 border-green-500 pl-4"
                >
                  <h4 className="font-bold text-gray-800 mb-1">{comp.topic}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {comp.similarities.slice(0, 2).map((sim, idx) => (
                      <li key={idx}>• {sim}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Notable Differences to Consider
          </h2>
          <div className="space-y-4">
            {comparisons
              .filter((c) => c.differences.length > 0)
              .slice(0, 5)
              .map((comp) => (
                <div
                  key={comp._id}
                  className="border-l-4 border-yellow-500 pl-4"
                >
                  <h4 className="font-bold text-gray-800 mb-1">{comp.topic}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {comp.differences.slice(0, 2).map((diff, idx) => (
                      <li key={idx}>• {diff}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Key Takeaways</h2>
        <div className="space-y-3">
          <p>
            ✓ All standards share common ground on fundamental project
            management principles, with <strong>{totalSimilarities}</strong>{" "}
            documented similarities.
          </p>
          <p>
            ⚠ There are <strong>{totalDifferences}</strong> key differences in
            approaches, terminology, and methodologies that should be considered
            when choosing a standard.
          </p>
          <p>
            ★ Each standard brings <strong>{totalUniquePoints}</strong> unique
            perspectives and practices that may be valuable depending on your
            project context.
          </p>
          <p className="mt-4 pt-4 border-t border-white/30">
            Use the Process Generator to get tailored recommendations based on
            your specific project requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
