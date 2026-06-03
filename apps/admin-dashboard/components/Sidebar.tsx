'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type SidebarItem = {
  label: string
  href: string
  icon: string
  children?: SidebarItem[]
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Konten', href: '/contents', icon: '📄' },
  { label: 'Media', href: '/media', icon: '🖼️' },
  { label: 'Users', href: '/users', icon: '👥' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-blue-600 text-white rounded-lg"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Overlay untuk mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/20 md:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">📰</span>
            <span className="font-bold text-lg text-gray-900">Milpers</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2">Management</p>
          <ul className="space-y-2">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + '/') ||
                (item.href === '/dashboard' && pathname === '/dashboard')

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">v1.0.0 — Admin Dashboard</p>
        </div>
      </aside>
    </>
  )
}
