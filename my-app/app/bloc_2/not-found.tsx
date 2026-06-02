import Link from 'next/link';
import styles from "@/app/styles/error-handling.module.scss";
 
export default function NotFound() {
    return (
        <div className={styles.notfound}>
            <h2 className={styles.h2}>Error 404</h2>
            <p className={styles.p}>File not found</p>
            <Link href="/" className={styles.link}>Return Home</Link>
        </div>
    )
}