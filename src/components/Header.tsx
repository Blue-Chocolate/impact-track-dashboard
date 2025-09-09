// components/Header.tsx
export default function Header({ onMenuClick }: any) {
  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow">
      <button className="md:hidden p-2" onClick={onMenuClick}>
        ☰
      </button>
      <h1 className="text-xl font-semibold">Impact Dashboard</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1 hidden md:block"
        />
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}
