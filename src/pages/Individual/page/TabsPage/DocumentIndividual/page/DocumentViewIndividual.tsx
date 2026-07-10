import { useNavigate, useParams, useLocation } from "react-router";
import { Folder } from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";
import { getEntityTypeFromPath } from "@utils/GetEntityType";
import { useLocalization } from "@hooks/useLocalization";

const getIcon = (colorClass: string) => (
  <div
    className={`flex p-4 items-center justify-center rounded-xl ${colorClass}`}
  >
    <Folder size={22} />
  </div>
);

const DocumentViewIndividual = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const entityId = String(id);
  const entityType = getEntityTypeFromPath(location.pathname);
  const { t } = useLocalization();

  const documentTypes = [
    {
      path: "DOC_USER",
      label: t("subject.individual.documents_page.doc_user"),
      iconColor: "bg-purple-500/[0.08] text-purple-500",
    },
    {
      path: "LICENSE",
      label: t("subject.individual.documents_page.licence"),
      iconColor: "bg-success-500/[0.08] text-success-500",
    },
    {
      path: "LICENSE_CARD",
      label: t("subject.individual.documents_page.licence_card"),
      iconColor: "bg-red-500/[0.08] text-red-500",
    },
    {
      path: "CERTIFICATE",
      label: t("subject.individual.documents_page.certificate"),
      iconColor: "bg-pink-500/[0.08] text-pink-500",
    },
    {
      path: "SPECIAL_PERMITS",
      label: t("subject.individual.documents_page.special_permits"),
      iconColor: "bg-yellow-500/[0.08] text-yellow-500",
    },
    {
      path: "E_TIR",
      label: "e-TIR",
      iconColor: "bg-orange-500/[0.08] text-orange-500",
    },
    {
      path: "I_T_PERMITS",
      label: t("subject.individual.documents_page.it_permits"),
      iconColor: "bg-blue-light-500/[0.08] text-blue-light-500",
    },
  ];

  return (
    <ComponentCard title={t("subject.individual.documents_page.title")}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4 p-4">
        {documentTypes.map(({ path, label, iconColor }) => (
          <button
            key={path}
            onClick={() =>
              navigate(
                `/registeredIndividuals/${entityType}/view/${entityId}/documents/${path}`,
              )
            }
            className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 w-[100%] h-[10vh] flex items-center"
          >
            <div className="flex items-center gap-4 ml-[4%]">
              {getIcon(iconColor)}
              <div>
                <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                  {label}
                </h4>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ComponentCard>
  );
};

export default DocumentViewIndividual;
