// import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      
      <div className={styles.container_stack}>

        <div className={styles.box_stack}>
        </div>

        <div className={styles.box_stack}>
        </div>

      </div>

      <div className={styles.container_stack}>

        <div className={styles.box}>
          <div className={styles.box_stack}>
          </div>

          <div className={styles.box_stack}>
          </div>
        </div>

        <div className={styles.onlyonebox_stack}>

        </div>

      </div>


    </div>
  );
}
