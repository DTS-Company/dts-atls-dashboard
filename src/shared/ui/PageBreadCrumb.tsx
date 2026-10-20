import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { useLocalization } from "@shared/lib/useLocalization";

interface BreadcrumbProps {
  pageTitle: React.ReactNode | string;
}

const PageBreadcrumb = ({ pageTitle }: BreadcrumbProps) => {
  const {t} = useLocalization()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              to="/"
            >
              {t("sidebar.main")}
              <ChevronRight size={16} />
            </Link>
          </li>
          <li className="text-[13px] font-semibold text-gray-700 dark:text-white [&_*]:!text-gray-500 dark:[&_*]:!text-gray-400">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};
export default PageBreadcrumb;
