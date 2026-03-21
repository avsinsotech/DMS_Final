import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => setDark(prev => !prev);

  // Apply theme to body
  useEffect(() => {
    if (dark) {
      document.documentElement.style.setProperty("--bg-main", "#0f1623");
      document.body.style.background = "#0f1623";
      document.body.classList.remove("light");
    } else {
      document.documentElement.style.setProperty("--bg-main", "#f5f7fb");
      document.body.style.background = "#f5f7fb";
      document.body.classList.add("light");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};