'use client'
import React from 'react'
import { useAuth } from '../../components/AuthProvider'
import { Sidebar } from '../../components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()
  
  if (!role || (role !== 'ADMIN' && role !== 'STAFF' && role !== 'SUPER_ADMIN')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">403 — Forbidden</h2>
          <p className="text-gray-600">Anda tidak memiliki akses ke dashboard ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6 sticky top-0 z-20">
          <div className="flex justify-between items-center max-w-7xl">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Role: <span className="font-semibold">{role}</span></span>
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                {role?.[0]?.toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
