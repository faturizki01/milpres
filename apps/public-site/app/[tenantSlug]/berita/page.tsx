import { fetchTenantContents } from '../../../lib/api'
import { ArticleList } from './ArticleList'

export const revalidate = 120

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params
  return {
    title: `Berita | ${tenantSlug}`,
    description: `Daftar berita dan artikel terkini untuk ${tenantSlug}.`,
  }
}

export default async function ArticleListPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params
  const contents = await fetchTenantContents(tenantSlug)

  return <ArticleList initialContents={contents || []} tenantSlug={tenantSlug} />
}

