import Link from 'next/link';

// Helper component for navigation links
const NavLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-3 rounded-xl transition-colors 
                   hover:bg-primary/20 hover:text-primary-foreground text-gray-400"
  // 💡 You would add logic here later to set the active state (e.g., using usePathname)
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);


export default function Sidebar() {
  return (
    <nav
      className="fixed top-0 left-0 h-screen w-60 bg-[#1e293b] dark:bg-gray-900 text-white p-6 
                       flex flex-col justify-between z-40 shadow-xl border-r border-gray-700/50"
    >
      {/* Top Section: Logo and Main Links */}
      <div className="flex flex-col gap-8">
        {/* Logo/Title (Top Left Corner) */}
        <div className="text-2xl font-bold tracking-wider text-primary mb-4">
          MyMediaHub
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          {/* Home/Watchlist Link (Assuming 'Home' is currently your Watchlist) */}
          <NavLink
            href="/watchlist"
            label="Home"
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.47 3.84a.75.75 0 011.06 0l8.64 8.64a.75.75 0 01.22 1.05.75.75 0 01-.19.22l-1.9 1.9V20a2 2 0 01-2 2H6a2 2 0 01-2-2v-4.65l-1.9-1.9a.75.75 0 01-.19-.22.75.75 0 01.22-1.05l8.64-8.64z" /></svg>}
          />

          {/* Movie Filter Link (Future dedicated page) */}
          <NavLink
            href="/watchlist?type=movie"
            label="Movies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16" fill="#9a8daa"><g fill="#9a8daa"><path d="M6 3a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" /><path d="M9 6a3 3 0 1 1 0-6a3 3 0 0 1 0 6z" /><path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7z" /></g></svg>}
          />

          {/* TV Show Filter Link (Future dedicated page) */}
          <NavLink
            href="/watchlist?type=series"
            label="TV Shows"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16"><path fill="#9a8daa" d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM2 2h12s2 0 2 2v6s0 2-2 2H2s-2 0-2-2V4s0-2 2-2z" /></svg>}
          />
        </div>
      </div>

      {/* Bottom Section: Settings and Logout */}
      <div className="flex flex-col gap-2 border-t pt-4 border-gray-700/50">
        {/* Settings Link */}
        <NavLink
          href="/settings"
          label="Settings"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16"><path fill="#9a8daa" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86a2.929 2.929 0 0 1 0 5.858z" /></svg>}
        />

        {/* Logout Link */}
        <NavLink
          href="/logout"
          label="Logout"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="#9a8daa" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z" /></svg>}
        />
      </div>
    </nav>
  );
}
