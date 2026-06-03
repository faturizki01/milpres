'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../components/AuthProvider'
import Link from 'next/link'

type Content = {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED'
  category?: { name: string }
  createdAt: string
  updatedAt: string
  viewCount: number
}

export default function ContentsList() {
  useAuth()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'popular'>('recent')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadContents = async () => {
      try {
        const res = await fetch('/api/mock-contents')
        const data = await res.json()
        setContents(data || [])
      } catch (e) {
        console.error('Failed to load contents', e)
      } finally {
        setLoading(false)
      }
    }
    loadContents()
  }, [])

  let filtered = contents
  
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
  }
  
  if (statusFilter) {
    filtered = filtered.filter(c => c.status === statusFilter)
  }

  if (sortBy === 'recent') {
    filtered = filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } else if (sortBy === 'oldest') {
    filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (sortBy === 'popular') {
    filtered = filtered.sort((a, b) => b.viewCount - a.viewCount)
  }

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'IN_REVIEW': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'PUBLISHED': 'bg-green-100 text-green-800',
      'ARCHIVED': 'bg-gray-100 text-gray-600',
      'REJECTED': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Konten</h1>
            <p className="text-gray-600 mt-1">Kelola artikel dan berita Anda</p>
          </div>
          <Link href="/contents/new" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            + Buat Konten
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Cari judul atau slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="recent">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="popular">Paling Populer</option>
            </select>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50" disabled={selectedIds.size === 0}>
                Hapus ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Memuat konten...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">Tidak ada konten ditemukan</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Judul</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Kategori</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Views</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Update</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(content.id)}
                        onChange={() => toggleSelect(content.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{content.title}</p>
                        <p className="text-sm text-gray-500">/{content.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {content.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {content.viewCount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(content.updatedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link href={`/contents/${content.id}`} className="text-blue-600 hover:underline">
                          Edit
                        </Link>
                        <button onClick={() => alert('Delete not implemented')} className="text-red-600 hover:underline">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t px-6 py-4 text-sm text-gray-600 bg-gray-50">
              Menampilkan {filtered.length} dari {contents.length} konten
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
