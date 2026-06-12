import { Bell, Search } from "lucide-react";

export default function Navbar({ title }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="text-lg font-semibold text-charcoal">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 w-52">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="text-sm w-full focus:outline-none bg-transparent text-charcoal placeholder-gray-400"
          />
        </div>
      </div>
    </header>
  );
}