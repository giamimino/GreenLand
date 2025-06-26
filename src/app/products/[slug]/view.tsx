"use client";

import { addView } from "@/actions/actions";
import { useEffect, useRef } from "react";

type Props = {
  product: { id: string } | null;
};

export default function ClientComponent({ product }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (formRef.current && product?.id && !submitted.current) {
      submitted.current = true;
      formRef.current.requestSubmit();
    }
  }, [product]);

  return (
    <form ref={formRef} action={addView}>
      <input type="text" name="id" hidden defaultValue={product?.id} />
    </form>
  );
}
