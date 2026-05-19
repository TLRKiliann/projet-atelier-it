import type { ItemsType } from "../../lib/definitions";
import { MdRecycling } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import styles from "../../styles/bloc.module.scss";

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

export default async function FluenceExo({params}: {params : Promise<{ id: string }>}) {

    const { id } = await params;

    if (!id) {
        return <div>Tâche non trouvée !</div>
    };

    console.log(typeof(id), "id of stack")

    return (
        <div className={styles.page_bloc}>
            <h1>Bloc n°1 étage n°{id}</h1>

            <div>
                {items_block_1.map((itemByStack: ItemsType) => {
                return String(itemByStack.id) === id ? (
                    <div key={itemByStack.id}>

                        {itemByStack.stack_title}

                        <div>
                            <div>
                                {itemByStack.item}
                            </div>
                            <div>
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