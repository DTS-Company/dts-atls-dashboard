import { useLocalization } from "@shared/lib/useLocalization";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const {t} = useLocalization()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800 bg-gray-100">
      <AlertCircle className="w-20 h-20 text-red-500 mb-4" />
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        404
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
        {t("not_found_page.title")}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        {t("not_found_page.back")}
      </Link>
    </div>
  );
}
