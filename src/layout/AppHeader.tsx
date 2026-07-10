import { useEffect, useRef, useState } from "react";
import { Ellipsis, Menu, X } from "lucide-react";
import { useSidebar } from "@context/SidebarContext";
import { ThemeToggleButton } from "@components/common/ThemeToggleButton";
import NotificationDropdown from "@components/header/NotificationDropdown";
import UserDropdown from "@components/header/UserDropdown";
import { SelectLang } from "@components/common/SelectLang";
import { useLocalization } from "@hooks/useLocalization";

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
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
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
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <Ellipsis />
          </button>
        </div>
        <h1 className="w-[100%] text-center text-[10px] text-gray-700 uppercase dark:text-white sm:text-[18px]">
          {t("common.title")}
        </h1>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-4">
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
