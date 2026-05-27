"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from "../styles/nav-menu.module.scss";

export default function DarkMode() {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <span className={styles.span} />;
    
    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles.btn_dark_mode}
            aria-label="Toggle dark mode"
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}