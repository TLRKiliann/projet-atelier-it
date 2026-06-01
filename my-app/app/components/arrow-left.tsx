import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

export default function ArrowLeft({blocId}: {blocId: string}) {

    const router = useRouter();

    return (
        <button onClick={() => router.push(`${blocId}`)} className={styles.btn_return}>
            <FaArrowLeft size={32} />
        </button>
    )
};