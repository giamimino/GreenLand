import prisma from '@/lib/prisma'
import ClientComponent from './clientComponent';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function Product({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: (await params).slug },
    select: {
      id: true,
      prevPrice: true,
      price: true,
      description: true,
      title: true,
      category: true,
      view: true,
      isSale: true,
      isBestSelling: true,
      image: true,
      stock: true,
    }
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
