import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";


function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  return <AppRoutes />;
}

export default App;
