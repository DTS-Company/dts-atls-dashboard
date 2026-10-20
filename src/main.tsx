import React from "react";
import ReactDOM from "react-dom/client";
import "@app/styles/index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "@shared/i18n/i18next";
import App from "@app/App";
import { ThemeProvider } from "@shared/lib/theme/ThemeContext";
import { AppWrapper } from "@shared/ui/PageMeta";
import { Provider } from "react-redux";
import { store } from "@app/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AppWrapper>
    </Provider>
  </React.StrictMode>
);
