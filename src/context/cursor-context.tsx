'use client';

import { createContext, useState, ReactNode } from 'react';

export type CursorState = 'default' | 'hover-sm' | 'hover-text' | 'hover-lg';

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

export const CursorContext = createContext<CursorContextType>({
  cursorState: 'default',
  setCursorState: () => {},
});

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorState, setCursorState] = useState<CursorState>('default');

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </CursorContext.Provider>
  );
};
