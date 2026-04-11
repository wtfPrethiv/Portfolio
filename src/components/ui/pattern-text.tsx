import React from 'react';
import { cn } from '@/lib/utils'; 

export function PatternText({
  text = 'Text',
  className,
  ...props
}: Omit<React.ComponentProps<'p'>, 'children'> & { text: string }) {
  return (
    <p
      data-shadow={text}
      className={cn(
        'relative inline-block font-black leading-[0.85] tracking-tighter uppercase',
        'text-black', 
        'after:absolute after:top-[0.06em] after:left-[0.06em] after:-z-10 after:content-[attr(data-shadow)]',
        'after:bg-[length:0.05em_0.05em] after:bg-clip-text after:text-transparent',
        'after:bg-[linear-gradient(45deg,transparent_45%,#000_45%,#000_55%,transparent_0)]',
        'after:animate-shadanim',
        className
      )}
      {...props}
    >
      {text}
    </p>
  );
}