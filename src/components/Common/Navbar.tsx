export function Navbar() {
  return (
    <header className="w-full bg-primary-600 text-white px-6 py-4 shadow-soft flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-tight">Impact Tracker</h1>

      
      <div className="flex items-center gap-4">
        <button
          className="hidden md:inline-flex px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          🔔
        </button>
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-semibold"
        >
          IT
        </div>
      </div>
    </header>
  );
}