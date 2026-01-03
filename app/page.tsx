import Dashboard from "@/components/dashboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <header className="px-2 pt-1 w-lg mx-auto">
        <h1 className="text-2xl font-bold">Lago en Línea</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitoreo de calidad del agua en tiempo real</p>
      </header>
      <main className="px-2 pb-8">
        <Dashboard />
      </main>
    </div>
  );
}
