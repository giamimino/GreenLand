import prisma from '@/lib/prisma'
import ClientComponent from './clientComponent';
import View from './view';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function Product({ params }: ProductPageProps) {
  const product = await prisma.products.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <ClientComponent product={product} />
      <View product={product} />
    </>
  );
}
