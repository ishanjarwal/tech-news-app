import Image from 'next/image';

export interface ThumbnailProps {
  src: string;
  alt: string;
}

export function Thumbnail({ src, alt }: ThumbnailProps) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
