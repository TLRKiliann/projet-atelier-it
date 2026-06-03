import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      
      <div className={styles.container_stack}>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="/bloc_1" className={styles.stack_link}><span>Bloc 1</span></Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_2" className={styles.stack_link}><span>Bloc 2</span></Link>
          </div>
        
        </div>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="/bloc_3" className={styles.stack_link}><span>Bloc 3</span></Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_4" className={styles.stack_link}><span>Bloc 4</span></Link>
          </div>
        
        </div>

      </div>

      <div className={styles.container_stack_2}>

        <div className={styles.box_stacks}>

          <div className={styles.stack}>
            <Link href="/bloc_5" className={styles.stack_link}><span>Bloc 5</span></Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_6" className={styles.stack_link}><span>Bloc 6</span></Link>
          </div>
        
        </div>

        <div className={styles.box_stacks}>
        
          <div className={styles.stack}>
            <Link href="/bloc_7" className={styles.stack_link}><span>Bloc 7</span></Link>
          </div>

          <div className={styles.stack}>
            <Link href="/bloc_8" className={styles.stack_link}><span>Bloc 8</span></Link>
          </div>

        </div>

        <div className={styles.box_stacks_9}>

          <div className={styles.stack_9}>
            <Link href="/bloc_9" className={styles.stack_link}><span>Bloc 9</span></Link>
          </div>

        </div>

      </div>


    </div>
  )
};