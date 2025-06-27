import prisma from '@/lib/prisma'
import ClientComponent from './clientComponent';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function Product({ params }: ProductPageProps) {
  const product = await prisma.products.findUnique({
    where: { slug: (await params).slug },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <ClientComponent product={{
        ...product,
        prevPrice: product.prevPrice === null ? undefined : product.prevPrice
      }} />
    </>
  );
}
