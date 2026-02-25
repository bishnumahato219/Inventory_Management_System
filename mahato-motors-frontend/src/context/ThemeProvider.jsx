import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (darkQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();
    darkQuery.addEventListener("change", applyTheme);

    return () => darkQuery.removeEventListener("change", applyTheme);
  }, []);

  return children;
}
