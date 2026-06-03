'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MdOutlineErrorOutline } from "react-icons/md";
import styles from "@/app/styles/error-handling.module.scss";

export default function ErrorBoundary({ 
    error, unstable_retry 
}: { error: Error & { digest?: string }
    unstable_retry: () => void }) {

    const router = useRouter();

    useEffect(() => {
        console.error(error)
    }, [error])
 
    return (
        <div className={styles.page_error}>
            <h1 className={styles.err_msg}>Error: {error.message}</h1>
            <button 
                type="button" 
                onClick={() => router.back()} 
                className={styles.btn_error}
            >
                <MdOutlineErrorOutline size={24} />
                <p className={styles.p_error}>Back</p>
            </button>
        </div>
    )
};