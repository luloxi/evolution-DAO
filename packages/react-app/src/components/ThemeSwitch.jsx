import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { switcher, currentTheme, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = isChecked => {
    setIsDarkMode(isChecked);
    const selectedTheme = isChecked ? themes.dark : themes.light;
    switcher({ theme: selectedTheme });
  };

  useEffect(() => {
    // Set the theme based on the initial value of isDarkMode
    const selectedTheme = isDarkMode ? themes.dark : themes.light;
    switcher({ theme: selectedTheme });
  }, [isDarkMode, switcher, themes]);

  return (
    <div className="main fade-in" style={{ position: "fixed", right: 8, bottom: 8 }}>
      <span style={{ padding: 8 }}>{currentTheme === "light" ? "☀️" : "🌜"}</span>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
