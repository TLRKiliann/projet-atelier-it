// import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      
      <div className={styles.container_stack}>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="./bloc_1">Bloc 1</Link>
          </div>

          <div className={styles.stack}>
            <Link href="./bloc_2">Bloc 2</Link>
          </div>
        
        </div>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="./bloc_3">Bloc 3</Link>
          </div>

          <div className={styles.stack}>
            <Link href="./bloc_4">Bloc 4</Link>
          </div>
        
        </div>

      </div>

      <div className={styles.container_stack_2}>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="./bloc_5">Bloc 5</Link>
          </div>

          <div className={styles.stack}>
            <Link href="./bloc_6">Bloc 6</Link>
          </div>
        
        </div>

        <div className={styles.box_stacks}>
        
          <div className={styles.stack}>
            <Link href="./bloc_7">Bloc 7</Link>
          </div>

          <div className={styles.stack}>
            <Link href="./bloc_8">Bloc 8</Link>
          </div>

        </div>

        <div className={styles.onlyone_stack}>
          <Link href="./bloc_9">Bloc 9</Link>
        </div>

      </div>


    </div>
  );
}
