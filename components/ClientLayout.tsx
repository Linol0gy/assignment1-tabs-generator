"use client";

import Header from "./Header";
import Footer from "./Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
  studentName: string;
  studentNumber: string;
}

export default function ClientLayout({ children, studentName, studentNumber }: ClientLayoutProps) {
  return (
    <>
      <div className="student-number">Student No. {studentNumber}</div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </>
  );
}