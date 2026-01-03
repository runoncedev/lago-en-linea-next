import Dashboard from "@/components/dashboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <header className="p-2 flex flex-col gap-1 max-w-lg w-full mx-auto">
        <h1 className="text-4xl font-bold">Lago en Línea</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Monitoreo de calidad del agua en tiempo real</p>
      </header>
      <main className="px-2 pb-8">
        <Dashboard />
      </main>
    </div>
  );
}
