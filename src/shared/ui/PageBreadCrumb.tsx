import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { useLocalization } from "@hooks/useLocalization";

interface BreadcrumbProps {
  pageTitle: React.ReactNode | string;
}

const PageBreadcrumb = ({ pageTitle }: BreadcrumbProps) => {
  const {t} = useLocalization()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              {t("sidebar.main")}
              <ChevronRight size={16} />
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};
export default PageBreadcrumb;
