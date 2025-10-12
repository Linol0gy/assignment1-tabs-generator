// Replace with your actual student details
const STUDENT_NAME = "jiawenqi song";
const STUDENT_NUMBER = "22503977";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Student Information</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <p className="mb-2"><strong>Name:</strong> {STUDENT_NAME}</p>
            <p><strong>Student Number:</strong> {STUDENT_NUMBER}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Video Tutorial: How to Use This Website</h3>
          <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video 
              controls 
              className="w-full h-full"
              poster="/video-poster.jpg"
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              <source src="/demo-video.webm" type="video/webm" />
              <p className="text-center p-8 text-gray-500">
                Your browser does not support the video tag. 
                <a href="/demo-video.mp4" download className="text-blue-500 underline ml-2">
                  Download the video
                </a>
              </p>
            </video>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Duration: 3-8 minutes | Demonstrates all features of the application
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h3 className="text-xl font-semibold mb-4">Application Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>HTML5 Code Generator:</strong> Creates standalone HTML with inline CSS and JavaScript</li>
            <li><strong>Tab Management:</strong> Add up to 15 customizable tabs with editable headers and content</li>
            <li><strong>Dark/Light Theme:</strong> Toggle between themes with persistent storage</li>
            <li><strong>Accessibility Compliant:</strong> ARIA labels and semantic HTML throughout</li>
            <li><strong>Cookie-based Navigation:</strong> Remembers your last visited page</li>
            <li><strong>LocalStorage Persistence:</strong> Your tab configurations are automatically saved</li>
          </ul>

          <h3 className="text-xl font-semibold mb-4 mt-6">How to Use</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to the <strong>Tabs</strong> page using the hamburger menu</li>
            <li>Click <strong>[+]</strong> to add new tabs (up to 15)</li>
            <li>Click on any tab header to edit its name</li>
            <li>Select a tab and add content in the content area</li>
            <li>Click <strong>Output</strong> to generate HTML code</li>
            <li>Copy the generated code and save as an .html file</li>
            <li>Open the HTML file in any browser - no dependencies required!</li>
          </ol>

          <h3 className="text-xl font-semibold mb-4 mt-6">Technical Implementation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Framework:</strong> Next.js 15.5.0 with TypeScript</li>
            <li><strong>Routing:</strong> App Router architecture</li>
            <li><strong>Styling:</strong> Tailwind CSS for development, inline styles for output</li>
            <li><strong>State Management:</strong> React hooks with localStorage persistence</li>
            <li><strong>Build Tool:</strong> Turbopack for fast development</li>
          </ul>
        </div>
      </div>
    </div>
  );
}