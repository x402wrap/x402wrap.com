import Image from 'next/image';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: { width: 140, height: 40 },
    md: { width: 200, height: 56 },
    lg: { width: 280, height: 80 },
  };
  
  const { width, height } = sizeMap[size];
  
  return (
    <div className="relative flex items-center" style={{ width, height }}>
      <Image
        src="/logo/logo-horizontal.png"
        alt="x402wrap"
        width={width}
        height={height}
        style={{ objectFit: 'contain', objectPosition: 'left' }}
        priority
      />
    </div>
  );
}

