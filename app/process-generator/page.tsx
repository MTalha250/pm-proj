"use client";

import { useState } from "react";
import { ProcessTemplate, Phase, Activity } from "@/lib/types";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";

export default function ProcessGeneratorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: "",
    projectSize: "",
    complexity: "",
    industry: "",
  });
  const [generatedProcess, setGeneratedProcess] =
    useState<ProcessTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(
    new Set([0])
  );

  const projectTypes = [
    "Software Development",
    "Construction",
    "Research & Development",
    "Product Development",
    "Infrastructure",
    "Event Management",
    "Marketing Campaign",
    "Business Transformation",
  ];

  const projectSizes = ["Small", "Medium", "Large"];
  const complexityLevels = ["Low", "Medium", "High"];
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Education",
    "Government",
    "Retail",
    "Energy",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const generateProcess = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/process-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedProcess(data.data);
        setStep(5);
      } else {
        alert(
          data.message ||
            "No matching process found. Please try different criteria."
        );
      }
    } catch (error) {
      console.error("Error generating process:", error);
      alert("Error generating process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (index: number) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPhases(newExpanded);
  };

  const downloadProcess = () => {
    if (!generatedProcess) return;

    const content = JSON.stringify(generatedProcess, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedProcess.name.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      projectType: "",
      projectSize: "",
      complexity: "",
      industry: "",
    });
    setGeneratedProcess(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Process Generator
        </h1>
        <p className="text-gray-600">
          Answer a few questions to generate a tailored project management
          process based on PM standards
        </p>
      </div>

      {step < 5 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      step >= s
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s ? <FiCheckCircle className="text-2xl" /> : s}
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2 font-medium">
                    {s === 1 && "Project Type"}
                    {s === 2 && "Size"}
                    {s === 3 && "Complexity"}
                    {s === 4 && "Industry"}
                  </div>
                </div>
                {idx < 3 && (
                  <div className="flex-1 h-1 mx-2" style={{ marginTop: '-24px' }}>
                    <div
                      className={`h-full transition-all ${
                        step > s ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What type of project is this?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  handleInputChange("projectType", type);
                  handleNext();
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.projectType === type
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <span className="font-semibold">{type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is the size of your project?
          </h2>
          <p className="text-gray-600 mb-6">
            Consider factors like team size, budget, duration, and scope
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {projectSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleInputChange("projectSize", size)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  formData.projectSize === size
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <span className="text-xl font-bold block mb-2">{size}</span>
                <span className="text-sm text-gray-600">
                  {size === "Small" && "< 10 people, < 6 months"}
                  {size === "Medium" && "10-50 people, 6-12 months"}
                  {size === "Large" && "> 50 people, > 12 months"}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.projectSize}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is the complexity level?
          </h2>
          <p className="text-gray-600 mb-6">
            Consider technical complexity, number of stakeholders, and risk
            level
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {complexityLevels.map((level) => (
              <button
                key={level}
                onClick={() => handleInputChange("complexity", level)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  formData.complexity === level
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <span className="text-xl font-bold block mb-2">{level}</span>
                <span className="text-sm text-gray-600">
                  {level === "Low" && "Well-defined, few dependencies"}
                  {level === "Medium" && "Some uncertainty, moderate risk"}
                  {level === "High" && "High uncertainty, complex dependencies"}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.complexity}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What industry is this for?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => handleInputChange("industry", ind)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.industry === ind
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <span className="font-semibold">{ind}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={generateProcess}
              disabled={!formData.industry || loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Generating..." : "Generate Process"}
              {!loading && <FiCheckCircle />}
            </button>
          </div>
        </div>
      )}

      {step === 5 && generatedProcess && (
        <div>
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-3xl font-bold mb-2">✓ Process Generated!</h2>
            <p className="text-lg">{generatedProcess.name}</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={downloadProcess}
                className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold"
              >
                <FiDownload /> Download JSON
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
              >
                Generate Another
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Process Details
            </h3>
            <p className="text-gray-700 mb-4">{generatedProcess.description}</p>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <span className="text-sm text-gray-600">Project Type</span>
                <p className="font-bold">{generatedProcess.projectType}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <span className="text-sm text-gray-600">Size</span>
                <p className="font-bold">{generatedProcess.projectSize}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <span className="text-sm text-gray-600">Complexity</span>
                <p className="font-bold">{generatedProcess.complexity}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <span className="text-sm text-gray-600">Industry</span>
                <p className="font-bold">{generatedProcess.industry}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Based on Standards:</span>
              <div className="flex gap-2 mt-2">
                {generatedProcess.basedOnStandards.map((std) => (
                  <span
                    key={std}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                  >
                    {std}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Process Phases & Activities
            </h3>
            <div className="space-y-4">
              {generatedProcess.phases.map((phase, phaseIdx) => (
                <div
                  key={phaseIdx}
                  className="border-2 border-gray-200 rounded-lg"
                >
                  <button
                    onClick={() => togglePhase(phaseIdx)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-gray-900">
                        {phaseIdx + 1}. {phase.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {phase.description}
                      </p>
                    </div>
                    {expandedPhases.has(phaseIdx) ? (
                      <FiChevronDown className="text-2xl" />
                    ) : (
                      <FiChevronRight className="text-2xl" />
                    )}
                  </button>

                  {expandedPhases.has(phaseIdx) && (
                    <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
                      <h5 className="font-bold text-gray-900 mb-3">
                        Activities:
                      </h5>
                      <div className="space-y-4">
                        {phase.activities.map((activity, actIdx) => (
                          <div
                            key={actIdx}
                            className="bg-white p-4 rounded-lg border"
                          >
                            <h6 className="font-bold text-gray-900 mb-2">
                              {activity.name}
                            </h6>
                            <p className="text-gray-700 text-sm mb-3">
                              {activity.description}
                            </p>

                            {activity.deliverables.length > 0 && (
                              <div className="mb-3">
                                <span className="text-sm font-semibold text-gray-700">
                                  Deliverables:
                                </span>
                                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                  {activity.deliverables.map((del, delIdx) => (
                                    <li key={delIdx}>{del}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {activity.standardReferences.length > 0 && (
                              <div>
                                <span className="text-sm font-semibold text-gray-700">
                                  Based on:
                                </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {activity.standardReferences.map(
                                    (ref, refIdx) => (
                                      <Link
                                        key={refIdx}
                                        href={`/repository?sectionId=${ref.sectionId}`}
                                        className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                      >
                                        {ref.standardName}: {ref.sectionTitle}
                                        <FiExternalLink className="text-xs" />
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {generatedProcess.tailoringGuidance.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tailoring Guidance
              </h3>
              <div className="space-y-2">
                {generatedProcess.tailoringGuidance.map((guidance, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">💡</span>
                    <p className="text-gray-700">{guidance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
