"use client";

interface OutputDisplayProps {
  code: string;
}

export default function OutputDisplay({ code }: OutputDisplayProps) {
  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert("Code copied to clipboard!");
    }
  };

  return (
    <div>
      {code && (
        <button
          onClick={copyToClipboard}
          className="mb-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          Copy Code
        </button>
      )}
      <div className="tab-output">
        {code || "Click 'Output' to generate HTML code"}
      </div>
    </div>
  );
}