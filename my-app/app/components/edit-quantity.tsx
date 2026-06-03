import styles from "@/app/styles/bloc.module.scss";

type EditQuantityType = {
    modelId: string;
    modelName: string;
    modelQuantite: number;
    handleUpdateQuantity: (modelId: string, value: number) => void;
};

export default function EditQuantity({
    modelId,
    modelName,
    modelQuantite,
    handleUpdateQuantity
}: EditQuantityType) {
    return (
        <div className={styles.model_info}>
            
            <span className={styles.model_name}>{modelName}</span>

            <div className={styles.model_quantity}>
                <span>Quantité: </span>
                <input
                    type="number"
                    value={modelQuantite}
                    onChange={(e) => {
                    const value: number = parseInt(e.target.value);
                        if (value >= 0) {
                            handleUpdateQuantity(modelId, value);
                        }
                    }}
                    className={styles.quantity_input}
                    min="0"
                />
            </div>
        </div>        
    )
};