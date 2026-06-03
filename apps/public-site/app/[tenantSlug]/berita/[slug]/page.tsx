import { fetchTenantArticle, fetchTenantContents } from '../../../../lib/api'
import type { ContentItem } from '../../../../lib/api'
import { excerpt, formatDate, estimateReadTime, buildArticleJsonLd } from '../../../../lib/format'
import { ArticleShareButtons } from '../../../../components/ArticleShareButtons'
import { FontSizeAdjuster } from '../../../../components/FontSizeAdjuster'
import { DarkModeToggle } from '../../../../components/DarkModeToggle'
import Link from 'next/link'
import { ArticleDetail } from './ArticleDetail'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string; slug: string }> }) {
  const { tenantSlug, slug } = await params
  const article = await fetchTenantArticle(tenantSlug, slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milpers.id'
  const imageUrl = article.ogImage?.storageKey || article.thumbnail?.storageKey || '/placeholder.svg'
  
  return {
    title: `${article.title} | ${tenantSlug}`,
    description: excerpt(article.excerpt || article.body),
    openGraph: {
      title: article.title,
      description: excerpt(article.excerpt || article.body),
      url: `${siteUrl}/${tenantSlug}/berita/${article.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'article'
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://milpers.id'),
    alternates: { canonical: `/${tenantSlug}/berita/${article.slug}` },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ tenantSlug: string; slug: string }> }) {
  const { tenantSlug, slug } = await params
  const article = await fetchTenantArticle(tenantSlug, slug)
  const allContents = await fetchTenantContents(tenantSlug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milpers.id'

  // Get related articles from same category, exclude current article
  const relatedArticles = allContents
    .filter(c => c.category?.slug === article.category?.slug && c.id !== article.id)
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt).getTime() - new Date(a.publishedAt || a.updatedAt).getTime())

  return <ArticleDetail article={article} relatedArticles={relatedArticles} tenantSlug={tenantSlug} siteUrl={siteUrl} />
}
