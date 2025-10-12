"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

const menuItems = [
  { href: "/tabs", label: "Tabs" },
  { href: "/pre-lab-questions", label: "Pre-lab Questions" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Save current path to cookie
    Cookies.set("lastVisitedPage", pathname, { expires: 7 });
  }, [pathname]);

  useEffect(() => {
    // Close menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-50 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${
          isOpen ? "transform rotate-90" : ""
        }`}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className="block w-full h-0.5 bg-current transition-all duration-300"></span>
          <span className="block w-full h-0.5 bg-current transition-all duration-300"></span>
          <span className="block w-full h-0.5 bg-current transition-all duration-300"></span>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Menu */}
          <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 min-w-[200px] animate-fadeIn">
            <ul className="py-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      pathname === item.href 
                        ? "font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}