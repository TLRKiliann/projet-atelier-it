import BtnHome from "./btn-home";
import ArrowLeft from "./arrow-left";
import styles from "@/app/styles/bloc.module.scss";

export default function MainTitle({phrase}: {phrase: string}) {
    return (
        <div className={styles.page_bloc}>
            <div className={styles.titleAndBtn}>
                <ArrowLeft blocId={"/bloc_1"} />

                <h1>{phrase}</h1>

                <BtnHome />
            </div>
        </div>
    )
}