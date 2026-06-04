import { FaBan, FaSave } from "react-icons/fa";
import styles from "@/app/styles/bloc.module.scss";

type ModelFormType = {
    newModeleNameInput: string;
    setNewModeleNameInput: React.Dispatch<React.SetStateAction<string>>;
    newModeleQuantity: number;
    setNewModeleQuantity: React.Dispatch<React.SetStateAction<number>>;
    handleAddModele: () => void;
    setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ModelForm({
    newModeleNameInput,
    setNewModeleNameInput,
    newModeleQuantity,
    setNewModeleQuantity,
    handleAddModele,
    setShowAddForm
}: ModelFormType) {
    return (
        <div className={styles.add_modele_form}>
            <div className={styles.input_model}>
                <input
                    type="text"
                    value={newModeleNameInput}
                    onChange={(e) => setNewModeleNameInput(e.target.value)}
                    placeholder="Nom du modèle"
                    className={styles.input_categomodel}
                />
                <input
                    type="number"
                    value={newModeleQuantity}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setNewModeleQuantity(isNaN(value) ? 0 : value);
                    }}
                    placeholder="Quantité"
                    className={styles.input_second}
                    min="0"
                />
            </div>
            <div className={styles.box_btn_modele}>
                <button onClick={handleAddModele} className={styles.btn_save_model}>
                    <FaSave size={24} />
                </button>
                <button onClick={() => setShowAddForm(false)} className={styles.btn_cancel_model}>
                    <FaBan size={24} />
                </button>
            </div>
        </div>
    )
};