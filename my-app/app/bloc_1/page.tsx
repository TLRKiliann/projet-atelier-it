import type { ItemsType } from "../lib/definitions";
import { MdRecycling } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import styles from "../styles/bloc.module.scss";
import Link from "next/link";

const items_block_1: ItemsType[] = [
    {
        id: 1,
        stack_title: "Etage 1",
        item: "Ecran",
        item_2: "Imac",
        item_3: "",
        number_item_1: 3, 
        number_item_2: 2,
        number_item_3: 0,  
    },
    {
        id: 2,
        stack_title: "Etage 2",
        item: "Ecran",
        item_2: "",
        item_3: "",
        number_item_1: 3, 
        number_item_2: 0,
        number_item_3: 0,  
    },
    {
        id: 3,
        stack_title: "Etage 3",
        item: "Claviers",
        item_2: "Souris",
        item_3: "G1, G2, G3",
        number_item_1: 3, 
        number_item_2: 2,
        number_item_3: 9,  
    }
];

export default function Bloc_1 () {
    return (
        <div className={styles.page_bloc}>
            <h1>Bloc 1</h1>

            <div className={styles.container_bloc}>

                {items_block_1.map((type_item: ItemsType) => (
                    <div key={type_item.id} className={styles.item_div}>

                        <div className={styles.titleOfStack}>
                            <h2>
                                {type_item.stack_title}
                            </h2>
                        </div>

                        <div className={styles.items_bloc}>

                            <div>
                                <Link href={`/bloc_1/${type_item.id}`}>{type_item.item === "" ? "Vide" : type_item.item}</Link>
                            </div>
    
                            <div className={styles.btn_block}>
                                <button className={styles.btn_change_block}>
                                    <span>
                                        <MdRecycling size={32} />
                                    </span>
                                </button>

                                <button className={styles.btn_del_bloc}>
                                    <span>
                                        <MdDeleteOutline size={32} />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.items_bloc}>
                            <div>
                                <Link href={`/bloc_1/${type_item.id}`}>{type_item.item_2 === "" ? "Vide" : type_item.item_2}</Link>
                            </div>
    
                            <div className={styles.btn_block}>
                                <button className={styles.btn_change_block}>
                                    <span>
                                        <MdRecycling size={32} />
                                    </span>
                                </button>

                                <button className={styles.btn_del_bloc}>
                                    <span>
                                        <MdDeleteOutline size={32} />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.items_bloc}>
                            <div>
                                <Link href={`/bloc_1/${type_item.id}`}>{type_item.item_3 === "" ? "Vide" : type_item.item_3}</Link>
                            </div>
    
                            <div className={styles.btn_block}>
                                <button className={styles.btn_change_block}>
                                    <span>
                                        <MdRecycling size={32} />
                                    </span>
                                </button>

                                <button className={styles.btn_del_bloc}>
                                    <span>
                                        <MdDeleteOutline size={32} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

// {}
// []