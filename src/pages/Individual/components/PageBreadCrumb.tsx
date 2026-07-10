import { useLocalization } from "@hooks/useLocalization";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle: React.ReactNode | string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  const navigate = useNavigate();
  const {t} = useLocalization();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
            >
              {t("subject.company.employees_table.back")}
              <ChevronRight size={16} />
            </button>
          </li>
          <li className="text-gray-800 dark:text-white/90">{pageTitle}</li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
