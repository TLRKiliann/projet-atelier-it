"use client";

import type { ItemsType } from "../lib/definitions";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdRecycling } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import styles from "../styles/bloc.module.scss";
import Link from "next/link";

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

export default function Bloc_1 () {
    
    const router = useRouter()

    const [newValue, setNewValue] = useState<string>("");
    const [switchToChange, setSwitchToChange] = useState<boolean>(false);


    const handleModify = (id: number, item: string): void => {
        console.log(id, "id -> number");
        console.log(item, "item -> string");
        setSwitchToChange((prev) => !prev);
    };

    const handleDelete = (id: number, item: string): void => {
        console.log(id, "id from delete");
        console.log(item, "item from delete");
    };


    const handleSwitch = (): void => {
        setSwitchToChange((prev) => !prev);
    }

    const handleSave = (id: number, val: string): void => {
        console.log(id, "id saved");
        console.log(val, "val saved");
        setSwitchToChange((prev) => !prev);
    };

    return (
        <div className={styles.page_bloc}>
            <div className={styles.titleAndBtn}>
                <h1>Bloc 1</h1>
                <button onClick={() => router.push("/")} className={styles.btn_home}>
                    <span>
                        <FaHome size={24} />
                    </span>
                </button>
            </div>

            <div className={styles.container_bloc}>

                {items_block_1.map((type_item: ItemsType) => (
                    <div key={type_item.id} className={styles.item_div}>

                        <div className={styles.titleOfStack}>
                            <h2>
                                {type_item.stack_title}
                            </h2>
                        </div>

                        <span onClick={() => router.push(`/bloc_1/${type_item.id}`)} className={styles.items_bloc}>

                            <div>
                                <Link href={`/bloc_1/${type_item.id}`}>{type_item.item_1 === "" ? "Vide" : type_item.item_1}</Link>
                            </div>
    
                            <div className={styles.btn_block}>
                                <button onClick={() => handleModify(type_item.id, type_item.item_1)} className={styles.btn_change_block}>
                                    <span>
                                        <MdRecycling size={32} />
                                    </span>
                                </button>

                                <button onClick={() => handleDelete(type_item.id, type_item.item_3)} className={styles.btn_del_bloc}>
                                    <span>
                                        <MdDeleteOutline size={32} />
                                    </span>
                                </button>
                            </div>
                        </span>

                        <span onClick={() => router.push(`/bloc_1/${type_item.id}`)} className={styles.items_bloc}>
                            <div>
                                {/* <Link href={`/bloc_1/${type_item.id}`}>{type_item.item_2 === "" ? "Vide" : type_item.item_2}</Link> */}

                                {switchToChange === true ? (
                                    <span>

                                        <p>{type_item.item_2 === "" ? "Vide" : type_item.item_2}</p>

                                        <input 
                                            type="text" 
                                            id="changeVal_2" 
                                            name="changeVal_2" 
                                            value={newValue} 
                                            onChange={(e) => e.target.value}
                                        />

                                        <button onClick={() => handleSave(type_item.id, newValue)}>Save</button>
                                    </span>
                                ) : (
                                    null
                                )}

                            </div>
    
                            <div className={styles.btn_block}>
                                <button onClick={() => handleModify(type_item.id, type_item.item_2)} className={styles.btn_change_block}>
                                    <span>
                                        <MdRecycling size={32} />
                                    </span>
                                </button>

                                <button onClick={() => handleDelete(type_item.id, type_item.item_2)} className={styles.btn_del_bloc}>
                                    <span>
                                        <MdDeleteOutline size={32} />
                                    </span>
                                </button>
                            </div>
                        </span>

                        <span onClick={() => router.push(`/bloc_1/${type_item.id}`)} className={styles.items_bloc}>
                            <div>
                                <Link href={`/bloc_1/${type_item.id}`}>{type_item.item_3 === "" ? "Vide" : type_item.item_3}</Link>
                            </div>
    
                            <div className={styles.btn_block}>
                                <button onClick={() => handleModify(type_item.id, type_item.item_3)} className={styles.btn_change_block}>
                                    <span>
                                        <MdRecycling size={32} />
                                    </span>
                                </button>

                                <button onClick={() => handleDelete(type_item.id, type_item.item_3)} className={styles.btn_del_bloc}>
                                    <span>
                                        <MdDeleteOutline size={32} />
                                    </span>
                                </button>
                            </div>
                        </span>
                    </div>
                ))}

            </div>
        </div>
    )
}

// {}
// []