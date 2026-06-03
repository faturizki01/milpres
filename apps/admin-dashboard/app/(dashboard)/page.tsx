'use client'

import { useAuth } from '../../components/AuthProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type DashboardStats = {
  totalContents: number
  publishedContents: number
  draftContents: number
  totalMedias: number
  totalUsers: number
  recentContents: Array<{ id: string; title: string; status: string; updatedAt: string }>
}

export default function DashboardPage() {
  useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalContents: 0,
    publishedContents: 0,
    draftContents: 0,
    totalMedias: 0,
    totalUsers: 0,
    recentContents: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const contentsRes = await fetch('/api/mock-contents')
        const contents = (await contentsRes.json()) || []

        const published = contents.filter((c: any) => c.status === 'PUBLISHED').length
        const drafts = contents.filter((c: any) => c.status === 'DRAFT').length

        setStats({
          totalContents: contents.length,
          publishedContents: published,
          draftContents: drafts,
          totalMedias: Math.floor(Math.random() * 50) + 20,
          totalUsers: Math.floor(Math.random() * 30) + 5,
          recentContents: contents.slice(0, 5),
        })
      } catch (e) {
        console.error('Failed to load stats', e)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const StatCard = ({ title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Memuat statistik...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white p-8">
        <h1 className="text-3xl font-bold">Selamat datang kembali! 👋</h1>
        <p className="mt-2 text-blue-100">Kelola konten, media, dan user dari dashboard ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Konten" value={stats.totalContents} color="#3b82f6" subtitle="artikel" />
        <StatCard title="Dipublikasikan" value={stats.publishedContents} color="#10b981" subtitle="live" />
        <StatCard title="Draft" value={stats.draftContents} color="#f59e0b" subtitle="sedang dibuat" />
        <StatCard title="Media" value={stats.totalMedias} color="#8b5cf6" subtitle="files" />
        <StatCard title="Users" value={stats.totalUsers} color="#ec4899" subtitle="active" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/contents/new" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition">
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-semibold text-gray-900">Buat Konten</h3>
            <p className="text-xs text-gray-600 mt-1">Tambah artikel baru</p>
          </Link>
          <Link href="/media" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition">
            <div className="text-2xl mb-2">📤</div>
            <h3 className="font-semibold text-gray-900">Upload Media</h3>
            <p className="text-xs text-gray-600 mt-1">Kelola file & gambar</p>
          </Link>
          <Link href="/users" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition">
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-xs text-gray-600 mt-1">Kelola pengguna</p>
          </Link>
        </div>
      </div>

      {/* Recent Contents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Konten Terbaru</h2>
          <Link href="/contents" className="text-blue-600 hover:underline text-sm font-medium">
            Lihat semua →
          </Link>
        </div>
        {stats.recentContents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada konten yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 font-semibold text-gray-900">Judul</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-900">Status</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-900">Update</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentContents.map((content) => (
                  <tr key={content.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{content.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        content.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : content.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(content.updatedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/contents/${content.id}`} className="text-blue-600 hover:underline text-sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
