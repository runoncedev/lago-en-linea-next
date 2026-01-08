import Dashboard from "@/components/dashboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <header className="p-2 px-4 pt-8">
        <div className="max-w-lg w-full mx-auto flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Lago en Línea</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Monitoreo de calidad del agua en tiempo real</p>
        </div>
      </header>
      <main className="px-4 pb-8">
        <Dashboard />
      </main>
    </div>
  );
}
