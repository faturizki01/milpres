'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { excerpt, formatDate } from '../../../lib/format'
import type { ContentItem } from '../../../lib/api'

type Props = {
  initialContents: ContentItem[]
  tenantSlug: string
}

export function ArticleList({ initialContents, tenantSlug }: Props) {
  const [filtered, setFiltered] = useState(initialContents)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    let result = initialContents

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt?.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter(item => item.category?.slug === selectedCategory)
    }

    setFiltered(result)
  }, [search, selectedCategory, initialContents])

  const categories = Array.from(
    new Map(
      initialContents
        .filter(c => c.category)
        .map(c => [c.category!.slug, c.category!])
    ).values()
  )

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Berita & Artikel</h1>
        <p className="text-gray-600">Informasi terkini dan terpercaya untuk semua kalangan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Semua Kategori ({initialContents.length})</option>
          {categories.map(cat => {
            const count = initialContents.filter(c => c.category?.slug === cat.slug).length
            return (
              <option key={cat.slug} value={cat.slug}>
                {cat.name} ({count})
              </option>
            )
          })}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">Tidak ada artikel yang ditemukan</p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedCategory('')
            }}
            className="text-blue-600 hover:underline"
          >
            Lihat semua artikel
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filtered.map((item) => (
              <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {item.thumbnail?.storageKey ? (
                    <img
                      src={item.thumbnail.storageKey}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <span className="text-blue-400">No image</span>
                    </div>
                  )}
                  {item.isBreakingNews && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                      BREAKING
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {item.isFeatured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                        Featured
                      </span>
                    )}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.category?.name || 'Umum'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-600">
                    <Link href={`/${tenantSlug}/berita/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {excerpt(item.excerpt || item.body)}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                    <span>{formatDate(item.publishedAt || item.updatedAt)}</span>
                    <span className="flex items-center gap-1">👁 {item.viewCount || 0}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center py-4 border-t">
            <p className="text-gray-600 text-sm">
              Menampilkan <span className="font-bold">{filtered.length}</span> dari <span className="font-bold">{initialContents.length}</span> artikel
            </p>
          </div>
        </>
      )}
    </section>
  )
}
