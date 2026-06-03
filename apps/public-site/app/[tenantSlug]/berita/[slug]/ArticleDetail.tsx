'use client'

import Link from 'next/link'
import { formatDate, estimateReadTime, excerpt } from '../../../../lib/format'
import { ArticleShareButtons } from '../../../../components/ArticleShareButtons'
import { FontSizeAdjuster } from '../../../../components/FontSizeAdjuster'
import { DarkModeToggle } from '../../../../components/DarkModeToggle'
import type { ContentItem } from '../../../../lib/api'
import { useState } from 'react'

type Props = {
  article: ContentItem
  relatedArticles: ContentItem[]
  tenantSlug: string
  siteUrl: string
}

export function ArticleDetail({ article, relatedArticles, tenantSlug, siteUrl }: Props) {
  const [comment, setComment] = useState('')
  const imageUrl = article.ogImage?.storageKey || article.thumbnail?.storageKey || '/placeholder.svg'
  const readingTime = estimateReadTime(article.body)

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b py-3 px-4">
        <div className="max-w-4xl mx-auto text-sm text-gray-600">
          <Link href={`/${tenantSlug}`} className="hover:text-blue-600">Beranda</Link>
          {' › '}
          <Link href={`/${tenantSlug}/berita`} className="hover:text-blue-600">Berita</Link>
          {' › '}
          <span className="text-gray-900 font-medium">{article.title}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {article.isBreakingNews && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">BREAKING NEWS</span>
            )}
            {article.isFeatured && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded">FEATURED</span>
            )}
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {article.category?.name || 'Umum'}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">{article.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 text-sm mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <span className="font-semibold">By</span>
              <span>{article.category?.name || 'Redaksi'}</span>
            </div>
            <span>•</span>
            <span>{formatDate(article.publishedAt || article.updatedAt)}</span>
            <span>•</span>
            <span>{readingTime} menit baca</span>
            <span>•</span>
            <span className="flex items-center gap-1">👁 {article.viewCount || 0} views</span>
          </div>

          {/* Tools */}
          <div className="flex gap-4 mb-6">
            <FontSizeAdjuster />
            <DarkModeToggle />
          </div>
        </header>

        {/* Feature Image */}
        {article.thumbnail?.storageKey && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.thumbnail.storageKey}
              alt={article.title}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="prose max-w-none mb-12">
          <div
            className="text-gray-800 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>

        {/* Article Footer */}
        <div className="border-t border-b py-6 mb-8">
          {article.tags && article.tags.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600 mr-3">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span key={t.tag.name} className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded">
                    #{t.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="mb-12">
          <h3 className="text-lg font-bold mb-4">Bagikan Artikel</h3>
          <ArticleShareButtons
            title={article.title}
            url={`${siteUrl}/${tenantSlug}/berita/${article.slug}`}
          />
        </div>

        {/* Comments Section (Stub) */}
        <section className="border-t pt-8 mb-12">
          <h3 className="text-2xl font-bold mb-6">Komentar ({0})</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              💡 Fitur komentar akan segera hadir. Saat ini Anda dapat menghubungi kami melalui email untuk feedback.
            </p>
          </div>

          <form className="mb-8 opacity-50 pointer-events-none">
            <h4 className="font-semibold mb-3">Tulis Komentar</h4>
            <textarea
              placeholder="Komentar Anda..."
              rows={4}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            />
            <button
              type="submit"
              disabled
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Kirim Komentar
            </button>
          </form>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="text-3xl font-bold mb-8">Baca Juga</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((item) => (
                <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {item.thumbnail?.storageKey && (
                    <img
                      src={item.thumbnail.storageKey}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.category?.name || 'Umum'}
                    </span>
                    <h4 className="font-bold text-lg mt-2 line-clamp-2 hover:text-blue-600">
                      <Link href={`/${tenantSlug}/berita/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {excerpt(item.excerpt || item.body)}
                    </p>
                    <div className="text-xs text-gray-500 mt-3">
                      {formatDate(item.publishedAt || item.updatedAt)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.excerpt || excerpt(article.body),
            image: imageUrl,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: { '@type': 'Organization', name: article.category?.name || 'Redaksi' },
            publisher: { '@type': 'Organization', name: tenantSlug },
          }),
        }}
      />
    </>
  )
}
