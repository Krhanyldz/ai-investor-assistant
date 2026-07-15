interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium uppercase text-zinc-500">
        Demo / sample data
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">{description}</p>
    </div>
  );
}
