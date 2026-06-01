import styles from "../styles/bloc.module.scss";
import { FaPlus } from "react-icons/fa";

type AddCategoryTypes = {
    setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
};

export default function AddCategory({setShowAddForm, children}: AddCategoryTypes) {
    return (
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.btn_add_modele}
          >
            <FaPlus /> {children}
          </button>
    )
};