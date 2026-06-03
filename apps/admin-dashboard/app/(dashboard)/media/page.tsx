'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../components/AuthProvider'
import Link from 'next/link'

type MediaItem = {
  id: string
  filename: string
  url: string
  size: number
  type: 'image' | 'video' | 'document'
  uploadedAt: string
  uploadedBy: string
  category?: string
}

const CATEGORIES = ['Featured Images', 'Thumbnails', 'Gallery', 'Documents', 'Videos']

export default function MediaPage() {
  useAuth()
  const [medias, setMedias] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const loadMedias = async () => {
      try {
        // Mock media data
        const mockMedias: MediaItem[] = [
          {
            id: '1',
            filename: 'hero-image-1.jpg',
            url: '/images/placeholder.svg',
            size: 2048000,
            type: 'image',
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Admin',
            category: 'Featured Images',
          },
          {
            id: '2',
            filename: 'thumb-small.jpg',
            url: '/images/placeholder.svg',
            size: 512000,
            type: 'image',
            uploadedAt: new Date(Date.now() - 86400000).toISOString(),
            uploadedBy: 'Admin',
            category: 'Thumbnails',
          },
          {
            id: '3',
            filename: 'gallery-photo.jpg',
            url: '/images/placeholder.svg',
            size: 3072000,
            type: 'image',
            uploadedAt: new Date(Date.now() - 172800000).toISOString(),
            uploadedBy: 'Editor',
            category: 'Gallery',
          },
        ]
        setMedias(mockMedias)
      } catch (e) {
        console.error('Failed to load medias', e)
      } finally {
        setLoading(false)
      }
    }
    loadMedias()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    // Simulate file upload
    setUploadProgress(30)
    setTimeout(() => setUploadProgress(70), 500)
    setTimeout(() => {
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
    }, 1000)
  }

  const filtered = medias.filter(m => {
    const matchCategory = !selectedCategory || m.category === selectedCategory
    const matchSearch = !search || m.filename.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600 mt-1">Kelola semua media, gambar, dan file Anda</p>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
          dragging
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="text-4xl mb-3">📁</div>
        <h3 className="font-semibold text-gray-900 mb-1">Drag & drop files here</h3>
        <p className="text-gray-600 text-sm mb-4">atau</p>
        <label className="inline-block">
          <input type="file" multiple hidden onChange={() => {}} />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Files
          </button>
        </label>
        <p className="text-xs text-gray-500 mt-4">Max 100MB per file. Supported: JPG, PNG, GIF, PDF, MP4</p>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari filename..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {view === 'grid' ? '📋 List' : '🔲 Grid'}
            </button>
          </div>
        </div>
      </div>

      {/* Media Gallery */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Memuat media...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">Tidak ada media ditemukan</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(media => (
            <div key={media.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {media.type === 'image' ? (
                  <img src={media.url} alt={media.filename} className="w-full h-full object-cover" />
                ) : media.type === 'video' ? (
                  <div className="text-4xl">🎬</div>
                ) : (
                  <div className="text-4xl">📄</div>
                )}
                <button className="absolute top-2 right-2 opacity-0 hover:opacity-100 bg-red-600 text-white p-1 rounded text-xs transition">
                  ✕
                </button>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-900 truncate">{media.filename}</p>
                <p className="text-xs text-gray-600 mt-1">{formatFileSize(media.size)}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(media.uploadedAt).toLocaleDateString('id-ID')}</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                    Edit
                  </button>
                  <button className="flex-1 px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Filename</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Size</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Uploaded</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(media => (
                <tr key={media.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{media.filename}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {media.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{formatFileSize(media.size)}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(media.uploadedAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t px-6 py-4 text-sm text-gray-600 bg-gray-50">
            Menampilkan {filtered.length} dari {medias.length} media
          </div>
        </div>
      )}
    </div>
  )
}
