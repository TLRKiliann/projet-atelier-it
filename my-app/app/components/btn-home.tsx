import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

export default function BtnHome() {

    const router = useRouter();

    return (
        <button onClick={() => router.push("/")} className={styles.btn_home}>
            <FaHome size={32} />
        </button>
    )
};