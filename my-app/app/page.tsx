// import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      
      <div className={styles.container_stack}>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="/bloc_1" className={styles.stack_link}>Bloc 1</Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_2" className={styles.stack_link}>Bloc 2</Link>
          </div>
        
        </div>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="/bloc_3" className={styles.stack_link}>Bloc 3</Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_4" className={styles.stack_link}>Bloc 4</Link>
          </div>
        
        </div>

      </div>

      <div className={styles.container_stack_2}>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="/bloc_5" className={styles.stack_link}>Bloc 5</Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_6" className={styles.stack_link}>Bloc 6</Link>
          </div>
        
        </div>

        <div className={styles.box_stacks}>
        
          <div className={styles.stack}>
            <Link href="/bloc_7" className={styles.stack_link}>Bloc 7</Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_8" className={styles.stack_link}>Bloc 8</Link>
          </div>

        </div>

        <div className={styles.box_stacks_9}>

          <div className={styles.stack_9}>
            <Link href="/bloc_9" className={styles.stack_link}>Bloc 9</Link>
          </div>

        </div>

      </div>


    </div>
  );
}
// {}
// []