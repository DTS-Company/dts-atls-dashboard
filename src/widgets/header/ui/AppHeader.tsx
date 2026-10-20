import { useEffect, useRef, useState } from "react";
import { Ellipsis, Menu, X } from "lucide-react";
import { useSidebar } from "@shared/lib/sidebar/SidebarContext";
import { ThemeToggleButton } from "@features/toggle-theme";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { SelectLang } from "@features/select-language";
import { useLocalization } from "@shared/lib/useLocalization";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { t } = useLocalization();
  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };
  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-3 z-999 mx-4 mt-3 flex rounded-2xl shadow-card atls-glass md:mx-7">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-4">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-2.5 border-b border-gray-200 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-2.5 dark:border-white/10">
          <button
            className="items-center justify-center w-[38px] h-[38px] text-brand-500 rounded-xl bg-brand-50 z-99999 hover:bg-brand-100 lg:flex dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X /> : <Menu />}
          </button>

          {/* <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden"
              src="./images/logo/logo.svg"
              alt="Logo ssd"
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link> */}

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-9 h-9 text-gray-600 rounded-lg z-99999 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-white/5"
          >
            <Ellipsis />
          </button>
        </div>
        <h1 className="w-[100%] text-center text-[10px] font-bold tracking-[0.08em] text-gray-700 uppercase sm:text-[13px] dark:text-white">
          {t("common.title")}
        </h1>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-3 px-5 py-3 lg:flex lg:justify-end lg:px-0 lg:py-2.5`}
        >
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <NotificationDropdown />
            <SelectLang />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
