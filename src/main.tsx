import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./i18n/i18next.js";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AppWrapper } from "./components/common/PageMeta";
import { Provider } from "react-redux";
import { store } from "./store/store";

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
