import { API_BASE_URL_REG } from "@shared/api/apiConfig";
import { clearTokens, hasTokens, setTokens } from "@shared/api/auth";
import AppLayout from "./layouts/AppLayout";
import { NotFound } from "@pages/not-found";
import { AtlsReferencePage } from "@pages/reference";
import { WaybillRegistry } from "@pages/waybill-registry";
import { WaybillCard } from "@pages/waybill-card";
import { getWaybillListPath } from "@entities/waybill";
import { AtlsReportPage } from "@pages/report";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router";
import { ToastContainer } from "react-toastify";

// Стартовая страница — реестр всех путевых листов
const HOME_PATH = getWaybillListPath("all");

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      const refreshTokenFromUrl = urlParams.get("refresh_token");

      if (tokenFromUrl && refreshTokenFromUrl) {
        setTokens(tokenFromUrl, refreshTokenFromUrl);
        setIsLoggedIn(true);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } else {
        setIsLoggedIn(hasTokens());
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    clearTokens();
    window.location.href = API_BASE_URL_REG;
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <Router>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 9999 }}
              toastStyle={{ minWidth: "350px" }}
            />
            <Routes>
              <Route element={<AppLayout />}>
                <Route
                  index
                  path="/"
                  element={<Navigate to={HOME_PATH} replace />}
                />
                <Route
                  path="/references"
                  element={<Navigate to={HOME_PATH} replace />}
                />
                <Route
                  path="/references/atls/:slug"
                  element={<AtlsReferencePage />}
                />
                <Route path="/waybills/:formSlug" element={<WaybillRegistry />} />
                <Route path="/waybill/:id" element={<WaybillCard />} />
                <Route path="/reports/atls/:slug" element={<AtlsReportPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </>
      ) : (
        <div className="flex justify-center mt-[3%]">
          <button
            className="w-[200px] h-[70px] bg-black text-[white]"
            onClick={handleLogin}
          >
            Войти
          </button>
        </div>
      )}
    </>
  );
}
