import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const UnderDevelopment = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();

  return (
    <div>
      <PageMeta title={t("underdevelopment.page")} description="" />
      <div className="mt-[200px] bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center transform transition-all duration-700 ease-out scale-90 opacity-0 animate-fadeInScale">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t("underdevelopment.page")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {t("underdevelopment.info")}
          </p>
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div
                className="w-[10px] h-[10px] bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-[10px] h-[10px] bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className="w-[10px] h-[10px] bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("underdevelopment.loading")}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            {t("underdevelopment.back")}
          </button>
        </div>
        <style>
          {`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fadeInScale {
            animation: fadeInScale 0.6s ease-out forwards;
          }
        `}
        </style>
      </div>
    </div>
  );
};

export default UnderDevelopment;
