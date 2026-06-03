'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../../../components/AuthProvider'
import { useRouter } from 'next/navigation'
import MediaPicker from '../../../../../components/MediaPicker'

const CATEGORIES = [
  { slug: 'berita', name: 'Berita' },
  { slug: 'feature', name: 'Feature' },
  { slug: 'tips', name: 'Tips & Trik' },
  { slug: 'tutorial', name: 'Tutorial' },
]

const STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']

export default function EditContent({ params }: { params: Promise<{ id: string }> }) {
  useAuth()
  const router = useRouter()
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    category: CATEGORIES[0].slug,
    tags: '',
    status: 'DRAFT',
    isFeatured: false,
    isBreakingNews: false,
  })

  useEffect(() => {
    (async () => {
      const { id: contentId } = await params
      setId(contentId)
      // Fetch content data
      try {
        const res = await fetch('/api/mock-contents')
        const contents = await res.json()
        const content = contents.find((c: any) => c.id === contentId)
        if (content) {
          setFormData({
            title: content.title || '',
            slug: content.slug || '',
            excerpt: content.excerpt || '',
            body: content.body || '',
            category: content.category?.slug || CATEGORIES[0].slug,
            tags: content.tags?.join(', ') || '',
            status: content.status || 'DRAFT',
            isFeatured: content.isFeatured || false,
            isBreakingNews: content.isBreakingNews || false,
          })
        }
      } catch (e) {
        console.error('Failed to load content', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [params])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    setFormData(prev => ({ ...prev, title, slug: prev.slug ? prev.slug : slug }))
  }

  const handleBodyInsertImage = (url: string) => {
    setFormData(prev => ({ ...prev, body: prev.body + `\n<img src="${url}" alt="" style="max-width: 100%; height: auto;"/>\n` }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Judul harus diisi')
      return
    }
    if (!formData.body.trim()) {
      alert('Konten harus diisi')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/mock-create?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert('Konten berhasil diperbarui')
        router.push('/contents')
      } else {
        alert('Gagal memperbarui konten')
      }
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Memuat konten...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Konten</h1>
          <p className="text-gray-600 mt-1">Perbarui artikel atau berita Anda</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Konten Utama</h2>

            {/* Title */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">Judul *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Masukkan judul artikel..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slug */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">URL Slug *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                  /berita/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="auto-generated"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">URL untuk artikel</p>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">Ringkasan</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Ringkasan singkat artikel (opsional)"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Body */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">Konten *</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Ketik konten artikel di sini..."
                  rows={12}
                  className="w-full px-4 py-3 focus:outline-none resize-none font-mono text-sm"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Support HTML basic dan markdown</p>
            </div>

            {/* Media Picker */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">Sisipkan Media</label>
              <MediaPicker onSelect={handleBodyInsertImage} />
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Metadata & Setelan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700 font-medium">Jadikan artikel unggulan</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBreakingNews}
                  onChange={(e) => setFormData(prev => ({ ...prev, isBreakingNews: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700 font-medium">Tandai sebagai breaking news</span>
              </label>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block font-semibold text-gray-900 mb-2">Tags (pisahkan dengan koma)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {saving ? 'Menyimpan...' : 'Perbarui Konten'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/contents')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
