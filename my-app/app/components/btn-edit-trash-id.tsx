import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "@/app/styles/bloc.module.scss";

type BtnEditTrashIdType = {
    modelId: string;
    modelName: string;
    setEditingModele: React.Dispatch<React.SetStateAction<string | null>>;
    setNewModeleName: React.Dispatch<React.SetStateAction<string>>;
    handleDeleteModele: (modelId: string, modelName: string) => void;
};

export default function BtnEditTrashId({
    modelId,
    modelName,
    setEditingModele,
    setNewModeleName,
    handleDeleteModele
}: BtnEditTrashIdType) {
    return (
        <div className={styles.model_actions}>
            <button
                onClick={() => {
                    setEditingModele(modelId);
                    setNewModeleName(modelName);
                }}
                className={styles.btn_edit}
            >
                <FaEdit size={24} />
            </button>
            <button
                onClick={() => handleDeleteModele(modelId, modelName)}
                className={styles.btn_delete}
            >
                <FaTrash size={20} />
            </button>
        </div>
    )
};