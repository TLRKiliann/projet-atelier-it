import Link from "next/link";
import DarkMode from "./dark-mode";
import { FaHome } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import styles from "../styles/nav-menu.module.scss";

export default function NavMenu() {
    return (
        <nav className={styles.navmenu}>
            <ul className={styles.ulmenu}>
                <li className={styles.li}>
                    <Link href="/">
                        <FaHome size={24} />
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_1">
                        Bloc 1
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_2">
                        Bloc 2
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_3">
                        Bloc 3
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_4">
                        Bloc 4
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_5">
                        Bloc 5
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_6">
                        Bloc 6
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_7">
                        Bloc 7
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_8">
                        Bloc 8
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/bloc_9">
                        Bloc 9
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link href="/printer">
                        <FaPrint size={22} />
                    </Link>
                </li>
                <li>
                    <DarkMode />
                </li>
            </ul>
        </nav>
    )
}
// {}