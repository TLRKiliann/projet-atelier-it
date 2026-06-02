import { FaBan, FaSave } from "react-icons/fa";
import styles from "./../styles/bloc.module.scss";

type EditModelType = {
    newModeleName: string;
    setNewModeleName: React.Dispatch<React.SetStateAction<string>>;
    modelName: string;
    modelId: string;
    handleRenameModele: () => void;
    setEditingModele: () => void;
};

export default function EditModel({
    newModeleName,
    setNewModeleName,
    modelName,
    handleRenameModele,
    setEditingModele
}: EditModelType) {
    return (
        <div className={styles.edit_form}>
            <input
                type="text"
                value={newModeleName}
                onChange={(e) => setNewModeleName(e.target.value)}
                placeholder={modelName}
                autoFocus
                className={styles.input}
            />
            <div>
                <button
                    onClick={() => handleRenameModele()}
                    className={styles.btn_save}
                >
                    <FaSave size={24} />
                </button>
                <button
                    onClick={() => setEditingModele()}
                    className={styles.btn_cancel}
                >
                    <FaBan size={24} />
                </button>
            </div>
        </div>
    )
};