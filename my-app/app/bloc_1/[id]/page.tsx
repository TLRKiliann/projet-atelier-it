import type { ItemsType } from "../../lib/definitions";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";

import { MdRecycling } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import styles from "../../styles/bloc.module.scss";

const items_block_1: ItemsType[] = [
    {
        id: 1,
        stack_title: "Etage 1",
        item_1: "Ecran",
        item_2: "Imac",
        item_3: "",
        number_item_1: 3, 
        number_item_2: 2,
        number_item_3: 0,  
    },
    {
        id: 2,
        stack_title: "Etage 2",
        item_1: "Ecran",
        item_2: "",
        item_3: "",
        number_item_1: 3, 
        number_item_2: 0,
        number_item_3: 0,  
    },
    {
        id: 3,
        stack_title: "Etage 3",
        item_1: "Claviers",
        item_2: "Souris",
        item_3: "G1, G2, G3",
        number_item_1: 3, 
        number_item_2: 2,
        number_item_3: 9,  
    }
];

export default async function FluenceExo({params}: {params : Promise<{ id: string }>}) {

    const { id } = await params;

    if (!id) {
        return <div>Tâche non trouvée !</div>
    };

    console.log(typeof(id), "id of stack")

    return (
        <div className={styles.page_bloc}>
            <div className={styles.titleAndBtn}>

                <h1>Bloc n°1 étage n°{id}</h1>

                <div className={styles.divDoubleBtn}>
                    <Link href="/" className={styles.btn_home}><span><FaHome size={24} /></span></Link>
                    <Link href="/bloc_1" className={styles.btn_return}><span><FaArrowRotateRight size={24} /></span></Link>
                </div>

            </div>

            <div className={styles.container_bloc}>

                
                {items_block_1.map((itemByStack: ItemsType) => {
                    return String(itemByStack.id) === id ? (
                        <div key={itemByStack.id} className={styles.item_div}>

                            <div className={styles.items_bloc_design}>

                                <span className={styles.items_bloc}>

                                    <div>
                                        <p>{itemByStack.item_1 !== "" ? itemByStack.item_1 : null}</p>
                                    </div>

                                </span>


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


                            <div className={styles.items_bloc_design}>

                                <span className={styles.items_bloc}>

                                    <div>
                                        <p>{itemByStack.item_2 !== "" ? itemByStack.item_2 : null}</p>
                                    </div>

                                </span>


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


                            <div className={styles.items_bloc_design}>

                                <span className={styles.items_bloc}>

                                    <div>
                                        <p>{itemByStack.item_3 !== "" ? itemByStack.item_3 : null}</p>
                                    </div>

                                </span>


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
                    ) : null;
                })}
            </div>
        </div>
    )
}

// {}
// []