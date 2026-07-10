export const TableLoadingAnimation = () => {
  return (
    <tr>
      <td colSpan={9999} className="p-0">
        <div className="flex items-center justify-center h-[300px] w-full">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/30" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-blue-300 border-b-transparent animate-spin animation-reverse" />
          </div>
        </div>
      </td>
    </tr>
  );
};
