interface FooterProps {
  studentName: string;
  studentNumber: string;
}

export default function Footer({ studentName, studentNumber }: FooterProps) {
  const currentDate = new Date().toLocaleDateString();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Copyright • {studentName} • Student No: {studentNumber} • {currentDate}
          </p>
        </div>
      </div>
    </footer>
  );
}