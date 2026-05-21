"use client";

import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

export default function PrintPage() {

    const router = useRouter();

    return (
        <div className={styles.page_bloc}>
            <div className={styles.titleAndBtn}>
                
                <h1>Print</h1>

                <button onClick={() => router.push("/")} className={styles.btn_home}>
                    <span><FaHome size={24} /></span>
                </button>

            </div>
        </div>
    )
}