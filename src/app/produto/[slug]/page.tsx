import type { Metadata } from 'next';
import { ProductDetailFeature } from '@/features/storefront';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7996';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE}/public/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return { title: 'Produto | Loja Oficial Alcateia' };
    }
    const product = (await res.json()) as {
      name?: string;
      description?: string;
      coverImageUrl?: string | null;
    };
    return {
      title: `${product.name || 'Produto'} | Loja Oficial Alcateia`,
      description: product.description || 'Produto oficial do Esporte Clube Pelotas.',
      openGraph: {
        title: product.name || 'Loja Oficial Alcateia',
        description: product.description || 'Produto oficial do Esporte Clube Pelotas.',
        images: product.coverImageUrl ? [{ url: product.coverImageUrl }] : [],
      },
    };
  } catch {
    return { title: 'Produto | Loja Oficial Alcateia' };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailFeature slug={slug} />;
}
