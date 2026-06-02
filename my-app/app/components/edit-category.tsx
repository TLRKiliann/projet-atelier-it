import { CategorieItem } from "@/lib/definitions";
import { FaBan, FaSave } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

type EditCategoryType = {
    newCategoryName: string;
    setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
    category: CategorieItem;
    setEditingCategory: () => void;
    handleRenameCategory: () => void;
};

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
                placeholder={category.nom}
                autoFocus
                className={styles.input}
            />
            <div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRenameCategory();
                    }}
                    className={styles.btn_save}
                >
                    <FaSave size={24} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory();
                    }}
                    className={styles.btn_cancel}
                >
                    <FaBan size={24} />
                </button>
            </div>
        </div>
    )
};