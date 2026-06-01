import { FaBan, FaSave } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

type Category = {
    id: string;
    nom: string;
    // autres propriétés si besoin
}

type EditCategoryType = {
    newCategoryName: string;
    //setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
    setNewCategoryName: (name: string) => void;
    category: Category;  // ← Ajouté
    setEditingCategory: () => void;
    handleRenameCategory: () => void;
}

export default function EditCategory({
    newCategoryName,
    setNewCategoryName,
    category,
    setEditingCategory,
    handleRenameCategory
}: EditCategoryType) {
    return (
        <div className={styles.edit_form} onClick={(e) => e.stopPropagation()}>
            <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={category.nom}  // ← Utilise category.nom
                autoFocus
                className={styles.input}
            />
            <div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRenameCategory();  // ← Appel sans paramètres
                    }}
                    className={styles.btn_save}
                >
                    <FaSave size={24} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory();  // ← Appel sans paramètres
                    }}
                    className={styles.btn_cancel}
                >
                    <FaBan size={24} />
                </button>
            </div>
        </div>
    )
}