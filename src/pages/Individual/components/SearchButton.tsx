import { useState } from "react";
import { Search } from "lucide-react";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const SearchButton = ({
  setSearch,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const {t} = useLocalization()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <>
      <div className="block">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <Search className="text-gray-400" />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`${t("subject.individual.table.search")}`} 
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
            />
          </div>
          <Button className="ml-4">{t("subject.individual.table.search_button")}</Button>
        </form>
      </div>
    </>
  );
};

export default SearchButton;
