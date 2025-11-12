'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Helper component for navigation links
const NavLink = ({ href, icon, label, isCurrent }: { href: string, icon: React.ReactNode, label: string, isCurrent: boolean }) => (
  <Link
    href={href}
    // 💡 Use Tailwind conditional logic to highlight the active link
    className={`flex items-center gap-3 p-3 rounded-xl transition-colors 
                    ${isCurrent
        ? 'bg-primary/20 text-white font-bold'
        : 'hover:bg-primary/20 hover:text-primary-foreground text-gray-400'
      }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  // For now, we'll keep it always open, but this state is ready for collapse
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 text-gray-400 text-sm font-semibold hover:text-white transition-colors"
      >
        {/* 💡 Icon placeholder for the main section link (e.g., list icon) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3.75 6.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5zM3.75 12h16.5a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5zM3.75 17.25h16.5a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5z" clipRule="evenodd" /></svg>
        <span>{title}</span>
      </button>

      {/* Sub-links indented */}
      {isOpen && <div className="ml-5 flex flex-col gap-1">{children}</div>}
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname(); // 💡 Get current path
  const searchParams = useSearchParams(); // 💡 Get current query parameters
  const currentType = searchParams.get('type'); // 'movie' or 'series'
  const isWatchlistActive = pathname === '/watchlist';

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
          <NavLink
            href="/"
            label="Home"
            isCurrent={pathname === '/'}
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.47 3.84a.75.75 0 011.06 0l8.64 8.64a.75.75 0 01.22 1.05.75.75 0 01-.19.22l-1.9 1.9V20a2 2 0 01-2 2H6a2 2 0 01-2-2v-4.65l-1.9-1.9a.75.75 0 01-.19-.22.75.75 0 01.22-1.05l8.64-8.64z" /></svg>}
          />

          <SidebarSection title="Watchlist">
            <NavLink
              href="/watchlist"
              label="All"
              // Logic: Active if on /watchlist AND no 'type' param
              isCurrent={isWatchlistActive && !currentType}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 1026 1024"><path fill="#9a8daa" d="M969.057 248h-1l-71-119l-127 17l80 120l-212 33l-81-120l-116 18l81 120l-220 35l-77-127l-122 24l81 121l-95 15h104l-64 127h128l64-127h192l-64 127h128l64-127h192l-64 127h128l64-127q26 0 45 18.5t19 44.5v512q0 27-19 45.5t-45 18.5h-895q-27 0-45.5-18.5T2.057 960V448q0-26 18.5-44.5t45.5-18.5q-5-2-12-5.5t-20.5-17.5t-16.5-31l-16-124q-3-25 13.5-45.5t42.5-23.5l882-137q26-3 46.5 13t23.5 41l16 124q3 25-13.5 45.5t-42.5 23.5zm-808 648h704q13 0 22.5-9.5t9.5-22.5t-9.5-22.5t-22.5-9.5h-704q-13 0-22.5 9.5t-9.5 22.5t9.5 22.5t22.5 9.5zm0-192h704q13 0 22.5-9t9.5-22.5t-9.5-23t-22.5-9.5h-704q-13 0-22.5 9.5t-9.5 23t9.5 22.5t22.5 9z" /></svg>}
            />

            {/* 2b. Movies Filter Link */}
            <NavLink
              href="/watchlist?type=movie"
              label="Movies"
              // Logic: Active if on /watchlist AND 'type' is 'movie'
              isCurrent={isWatchlistActive && currentType === 'movie'}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor"><g fill="#9a8daa"><path d="M6 3a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" /><path d="M9 6a3 3 0 1 1 0-6a3 3 0 0 1 0 6z" /><path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7z" /></g></svg>}
            />

            {/* 2c. TV Show Filter Link */}
            <NavLink
              href="/watchlist?type=series"
              label="TV Shows"
              // Logic: Active if on /watchlist AND 'type' is 'series'
              isCurrent={isWatchlistActive && currentType === 'series'}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16"><path fill="currentColor" d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM2 2h12s2 0 2 2v6s0 2-2 2H2s-2 0-2-2V4s0-2 2-2z" /></svg>}
            />
          </SidebarSection>
        </div>
      </div>

      {/* Bottom Section: Settings and Logout */}
      <div className="flex flex-col gap-2 border-t pt-4 border-gray-700/50">
        {/* Settings Link */}
        <NavLink
          href="/settings"
          label="Settings"
          isCurrent={false}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16"><path fill="currentColor" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86a2.929 2.929 0 0 1 0 5.858z" /></svg>}
        />

        {/* Logout Link */}
        <NavLink
          href="/logout"
          label="Logout"
          isCurrent={false}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z" /></svg>}
        />
      </div>
    </nav>
  );
}
