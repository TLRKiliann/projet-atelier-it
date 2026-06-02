import type { Metadata } from 'next'
import Link from 'next/link';
import styles from "@/app/styles/bloc.module.scss";
 
export const metadata: Metadata = {
    title: 'Not Found',
    description: 'The page you are looking for does not exist.',
}
 
export default function GlobalNotFound() {
    return (
        <div className={styles.page_bloc}>
            <h3 className='text-3xl text-slate-400'>Error 404 - Not Found</h3>
            <Link href="/">                
                Back to Home
            </Link>
        </div>
    )
}