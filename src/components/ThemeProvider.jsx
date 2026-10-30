'use client';
// Third-party Imports
import { ThemeProvider as NextThemesProvider } from 'next-themes';
export const ThemeProvider = ({ children, ...props })=>{
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
