import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "@/app/styles/bloc.module.scss";

type ShowHideCategoryTypes = {
    setEditingCategory: () => void;
    setNewCategoryName: () => void;
    handleDeleteCategory: () => void;
}

export default function ShowHideCategory({
    setEditingCategory,
    setNewCategoryName,
    handleDeleteCategory
}: ShowHideCategoryTypes) {
    return (
        <div className={styles.btn_bloc} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory();
                    setNewCategoryName();
                }}
                className={styles.btn_edit}
            >
                <FaEdit size={24} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory();
                }}
                className={styles.btn_delete}
            >
                <FaTrash size={20} />
            </button>
        </div>
    )
}