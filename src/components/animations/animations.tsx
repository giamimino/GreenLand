import React, { useEffect, useState } from 'react'

type CountingProps = {
  end: number,
  content: string,
  style?: any
}

export function Counting(props: CountingProps) {
  const [item, setItem] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = props.end;
    const duration = 2000;
    const stepTime = 50;
    const increment = Math.ceil(end / (duration / stepTime));
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        setItem(end);
        clearInterval(interval);
      } else {
        setItem(start);
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={props.style} className='px-[48px]'>
      <h1 className='text-3xl font-medium'>{item}+</h1>
      <p className='text-[18px] font-medium'>{props.content}</p>
    </div>
  )
}
