"use client";

import Navigation from "./Navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tabs Generator</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}