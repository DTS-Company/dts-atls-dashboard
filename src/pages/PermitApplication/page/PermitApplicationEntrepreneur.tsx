import { useNavigate } from "react-router";
import { Folder } from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";

const PermitApplicationEntrepreneur = () => {
  const navigate = useNavigate();
  return (
    <>
      <ComponentCard title="Список заявки для индивидиуалного предпринимаетелья ">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="max-w-full overflow-x-auto min-h-[83vh]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 p-4">
              <button
                onClick={() =>
                  navigate("/licensing/entrepreneurPermitApplicationTable")
                }
                className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 w-[100%] h-[10vh] flex items-center"
              >
                <div className="flex items-center gap-4 ml-[4%]">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-success-500/[0.08] text-success-500">
                    <Folder size={20} />
                  </div>
                  <div>
                    <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      Лицензии
                    </h4>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  );
};

export default PermitApplicationEntrepreneur;
