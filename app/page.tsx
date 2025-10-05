import Link from "next/link";
import {
  FiBook,
  FiBarChart2,
  FiSettings,
  FiArrowRight,
  FiCopy,
  FiLayers,
} from "react-icons/fi";

export default function Home() {
  const features = [
    {
      title: "Standards Repository",
      description:
        "Explore PMBOK 7, PRINCE2, and ISO standards with searchable, navigable text and bookmarking features.",
      icon: FiBook,
      href: "/repository",
      color: "from-blue-500 to-blue-600",
      stats: "5 Standards",
    },
    {
      title: "Comparison Engine",
      description:
        "Compare standards side-by-side with deep linking to exact sections and highlighted differences.",
      icon: FiCopy,
      href: "/compare",
      color: "from-purple-500 to-purple-600",
      stats: "7 Comparisons",
    },
    {
      title: "Insights Dashboard",
      description:
        "View summaries of similarities, differences, and unique points across all standards.",
      icon: FiBarChart2,
      href: "/insights",
      color: "from-green-500 to-green-600",
      stats: "4 Categories",
    },
    {
      title: "Process Generator",
      description:
        "Generate tailored project processes based on your specific project scenario and requirements.",
      icon: FiSettings,
      href: "/process-generator",
      color: "from-orange-500 to-orange-600",
      stats: "4 Templates",
    },
  ];

  const stats = [
    { label: "PM Standards", value: "5", icon: FiLayers },
    { label: "Content Sections", value: "664", icon: FiBook },
    { label: "Comparisons", value: "7", icon: FiCopy },
    { label: "Process Templates", value: "4", icon: FiSettings },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            Educational PM Platform
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          PM Standards Comparison Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Explore, compare, and apply project management standards from PMBOK
          7th Edition, PRINCE2, and ISO 21500/21502 to build better project
          processes.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-4 text-center transform transition-all hover:scale-105 hover:shadow-lg"
              >
                <Icon className="text-3xl text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`bg-gradient-to-r ${feature.color} p-6 relative overflow-hidden`}>
                <Icon className="text-5xl text-white mb-2 relative z-10" />
                <div className="absolute top-0 right-0 text-6xl text-white opacity-10">
                  <Icon />
                </div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                  {feature.stats}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                  {feature.title}
                  <FiArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          About This Platform
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This platform helps project managers, students, and researchers
            navigate and compare globally recognized project management
            standards:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>PMBOK Guide 7th Edition</strong> - Project Management Body
              of Knowledge
            </li>
            <li>
              <strong>Process Groups Practice Guide</strong> - PMI supplementary
              guidance
            </li>
            <li>
              <strong>PRINCE2 (2023)</strong> - Managing Successful Projects
            </li>
            <li>
              <strong>ISO 21500:2021</strong> - Project, programme and portfolio
              management context
            </li>
            <li>
              <strong>ISO 21502:2020</strong> - Guidance on project management
            </li>
          </ul>
          <p>
            Use this platform to understand how different standards approach
            topics like risk management, stakeholder engagement, and project
            lifecycle, and generate tailored processes for your projects.
          </p>
        </div>
      </div>

      <div className="mt-8 p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
        <p className="mb-6 text-lg">
          Explore the standards repository or generate a custom process for your
          next project.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/repository"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Browse Standards
          </Link>
          <Link
            href="/process-generator"
            className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
          >
            Generate Process
          </Link>
        </div>
      </div>
    </div>
  );
}
