/**
 * Госномер в рамке, как настоящая табличка.
 * Код региона выделяется, только если номер кончается на 2 цифры через пробел: «4418 АВ 01».
 */
const PlateNumber = ({ value }: { value?: string | null }) => {
  if (!value) return <>—</>;
  const match = value.trim().match(/^(.*\S)\s+(\d{2})$/);
  const [main, region] = match ? [match[1], match[2]] : [value.trim(), ""];

  return (
    <span className="inline-flex overflow-hidden rounded border-[1.5px] border-gray-700 bg-white text-[12px] font-bold leading-none text-gray-900 dark:border-gray-950 dark:bg-gray-100">
      <span className="px-1.5 py-1 whitespace-nowrap">{main}</span>
      {region && (
        <span className="flex items-center border-l-[1.5px] border-gray-700 px-1.5 text-[10px] dark:border-gray-950">
          {region}
        </span>
      )}
    </span>
  );
};

export default PlateNumber;
