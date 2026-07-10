import React from "react";

const Tabs = ({ children }: { children: React.ReactNode }) => {
  return <div className=" p-6 border border-gray-200 rounded-xl mt-4 w-full overflow-x-auto dark:border-gray-800 bg-white  dark:bg-white/[0.03]">{children}</div>;
};

const TabList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 border-b border-gray-200 dark:border-gray-800">
      <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
        {children}
      </nav>
    </div>
  );
};

const Tab = ({
  isActive,
  children,
  onClick,
  icon,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-brand-500 border-brand-500 dark:text-brand-400 dark:border-brand-400"
          : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
    >
      {icon}
      {children}
    </button>
  );
};

const TabPanels = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-4">{children}</div>;
};

const TabPanel = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm text-gray-500 dark:text-gray-400">{children}</div>;
};
export { Tabs, TabList, Tab, TabPanels, TabPanel };
