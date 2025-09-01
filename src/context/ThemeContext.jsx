// import { createContext, useState, useEffect } from "react";

// export const ThemeContext = createContext();

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState("dark");

//   // Local storage se theme load karna
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.documentElement.classList.add(savedTheme);
//   }, []);

//   // Jab theme change ho to update karna
//   useEffect(() => {
//     document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
//     document.documentElement.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export  function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // default dark

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
