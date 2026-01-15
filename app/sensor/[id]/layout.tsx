import Link from "next/link";

export default function SensorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <nav className="border-slate-200 dark:border-slate-700 border-b  px-4 py-2">
        <div className="max-w-lg mx-auto">
          <Link href="/" className="dark:text-slate-300 text-slate-600">
            &gt;
            Lago en Línea
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}