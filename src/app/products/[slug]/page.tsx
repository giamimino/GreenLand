import prisma from '@/lib/prisma'
import ClientComponent from './clientComponent';
import { addView } from '@/actions/actions';
import View from './view';

export default async function page({ params }: { params: { slug: string } }) {
  const product = await prisma.products.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return (
    <>
      <ClientComponent
        product={product}
      />
      <View 
        product={product}
      />
    </>
  );
}
