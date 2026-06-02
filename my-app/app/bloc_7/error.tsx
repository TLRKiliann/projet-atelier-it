'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from "@/app/styles/bloc.module.scss";

export default function ErrorBoundary({ 
    error, unstable_retry 
}: { error: Error & { digest?: string }
    unstable_retry: () => void }) {

    const router = useRouter();

    useEffect(() => {
        console.error(error)
    }, [error])
 
    return (
        <div className={styles.page_bloc}>
            <h1 className={styles.title}>Error: {error.message}</h1>
            <button 
                type="button" 
                onClick={() => router.back()} 
                className={styles.btn_error}
            >
                Back to Bloc
            </button>
            <button
                type="button"
                onClick={() => unstable_retry()}
                className={styles.btn_retry}
            >
                Click
            </button>
        </div>
    )
};