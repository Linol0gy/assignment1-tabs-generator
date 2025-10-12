import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">HTML5 Code Generator</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This application generates HTML5 code with JavaScript and inline CSS for use in MOODLE
            LMS. Start by navigating to the Tabs page to create your custom tab components.
          </p>
          <Link
            href="/tabs"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started {'>'}
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Generate standalone HTML5 code</li>
            <li>No external CSS classes</li>
            <li>Inline styles and JavaScript</li>
            <li>Dark/Light theme support</li>
            <li>Accessibility compliant</li>
            <li>Cookie-based navigation memory</li>
            <li>Court Room scenario with escalating compliance checks</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Available Generators</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/tabs"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold mb-2">Tabs Generator</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create interactive tab components with custom content
            </p>
          </Link>

          <Link
            href="/court-room"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold mb-2">Court Room</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Handle stakeholder distractions, fix compliance issues, and avoid a summons
            </p>
          </Link>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg opacity-60">
            <h4 className="font-semibold mb-2">Escape Room</h4>
            <p className="text-sm text-gray-500">Coming in a future assignment</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg opacity-60">
            <h4 className="font-semibold mb-2">Coding Races</h4>
            <p className="text-sm text-gray-500">Coming in a future assignment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
