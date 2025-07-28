import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Create light theme
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#FF6B6B' },
      secondary: { main: '#4ECDC4' },
      background: {
        default: '#f8faff',
        paper: '#ffffff'
      },
      text: {
        primary: '#333333',
        secondary: '#666666'
      }
    },
    typography: { fontFamily: '"Poppins","Roboto",sans-serif' }
  });

  // Create dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#FF6B6B' },
      secondary: { main: '#4ECDC4' },
      background: {
        default: '#121212',
        paper: '#1e1e1e'
      },
      text: {
        primary: '#ffffff',
        secondary: '#cccccc'
      },
      divider: '#333333'
    },
    typography: { fontFamily: '"Poppins","Roboto",sans-serif' }
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
