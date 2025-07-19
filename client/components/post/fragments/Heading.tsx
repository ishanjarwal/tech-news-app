export interface HeadingProps {
  title: string;
}

export function Heading({ title }: HeadingProps) {
  return (
    <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-6xl">
      {title}
    </h1>
  );
}
