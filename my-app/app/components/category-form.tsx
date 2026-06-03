import { BlocItem, EtageItem } from "@/lib/definitions";
import { FaBan, FaSave } from "react-icons/fa";
import styles from "@/app/styles/bloc.module.scss";

type CategoryFormTypes = {
    selectedEtageId: string;
    setSelectedEtageId: React.Dispatch<React.SetStateAction<string>>;
    bloc: BlocItem;
    newCategoryNameInput: string;
    setNewCategoryNameInput: React.Dispatch<React.SetStateAction<string>>;
    handleAddCategory: () => void;
    setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CategoryForm({
    selectedEtageId,
    setSelectedEtageId,
    bloc,
    newCategoryNameInput,
    setNewCategoryNameInput,
    handleAddCategory,
    setShowAddForm
}: CategoryFormTypes) {
    return (
        <div className={styles.add_modele_form}>
            <div className={styles.input_model}>
                <select
                        value={selectedEtageId}
                        onChange={(e) => setSelectedEtageId(e.target.value)}
                        className={styles.select}
                    >
                    <option value="">Choisir un étage</option>
                    {bloc.etages.map((etage: EtageItem) => (
                        <option key={etage.id} value={etage.id}>{etage.nom}</option>
                    )).reverse()}
                </select>
                <input
                    type="text"
                    value={newCategoryNameInput}
                    onChange={(e) => setNewCategoryNameInput(e.target.value)}
                    placeholder="Nom de la catégorie"
                    className={styles.input_second}
                />
            </div >
            <div className={styles.box_btn_modele}>
                <button onClick={handleAddCategory} className={styles.btn_save_model}>
                    <FaSave size={24} />
                </button>
                <button onClick={() => setShowAddForm(false)} className={styles.btn_cancel_model}>
                    <FaBan size={24} />
                </button>
            </div>
        </div>
    )
};