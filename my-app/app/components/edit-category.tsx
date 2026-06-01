import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

type EditCategoryTypes = {
    setEditingCategory: ;
    setNewCategoryName: ;
    handleDeleteCategory: ;
}

export default function EditCategory({
    setEditingCategory,
    setNewCategoryName,
    handleDeleteCategory
}: EditCategoryTypes) {
    return (
        <div className={styles.btn_bloc} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory({
                        etageId: etage.id,
                        categoryId: category.id,
                        categoryNom: category.nom
                    });
                    setNewCategoryName(category.nom);
                }}
                className={styles.btn_edit}
            >
                <FaEdit size={24} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id, category.nom);
                }}
                className={styles.btn_delete}
            >
                <FaTrash size={20} />
            </button>
        </div>
    )
}