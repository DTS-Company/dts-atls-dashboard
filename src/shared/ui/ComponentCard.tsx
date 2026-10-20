interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

const ComponentCard= ({
  title,
  children,
  className = "",
  desc = "",
}: ComponentCardProps) => {
  return (
    <div
      className={`rounded-[18px] h-auto shadow-card atls-glass ${className}`}
    >
      <div className="px-5 py-4">
        <h3 className="text-[17px] font-bold tracking-[-0.01em] text-gray-700 dark:text-white">
          {title}
        </h3>
        {desc && (
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>
      <div className="p-4 sm:px-5 sm:pb-5 sm:pt-1">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
