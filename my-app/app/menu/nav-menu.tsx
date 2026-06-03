import Link from "next/link";
import DarkMode from "../components/dark-mode";
import { FaHome } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import styles from "../styles/nav-menu.module.scss";

export default function NavMenu() {
    return (
        <nav className={styles.navmenu}>
            <ul className={styles.ulmenu}>
                <li className={styles.li}>
                    <Link href="/">
                        <span>
                            <FaHome size={26}/>
                        </span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_1">
                        <span>Bloc 1</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_2">
                        <span>Bloc 2</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_3">
                        <span>Bloc 3</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_4">
                        <span>Bloc 4</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_5">
                        <span>Bloc 5</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_6">
                        <span>Bloc 6</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_7">
                        <span>Bloc 7</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_8">
                        <span>Bloc 8</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_9">
                        <span>Bloc 9</span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/printer">
                        <span>
                            <FaPrint size={22}/>
                        </span>
                    </Link>
                </li>
                <li className={styles.li}>
                    <span>
                        <DarkMode />
                    </span>
                </li>
            </ul>
        </nav>
    )
};