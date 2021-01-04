import React, { useMemo } from 'react';

export interface SkelectonProps {
  length: number;
  fill?: string;
  children?: React.ReactNode;
}

const color = '#ccc';

export const skelectonStyle: React.CSSProperties = {
  color,
  backgroundImage: `linear-gradient(0deg, ${color}, ${color})`,
  backgroundPosition: `center`,
  backgroundSize: `100% 80%`,
  backgroundRepeat: 'no-repeat',
  userSelect: 'none',
  whiteSpace: 'break-spaces',
  wordBreak: 'break-all'
};

export function Skelecton({ fill = '\t', length, children }: SkelectonProps) {
  const content = useMemo(
    () => Array.from({ length }).reduce<string>(s => s + fill, ''),
    [length, fill]
  );

  return children ? (
    <>{children}</>
  ) : (
    <span style={skelectonStyle}>{content}</span>
  );
}
