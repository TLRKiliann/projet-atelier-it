import { CategorieItem } from "@/lib/definitions";
import styles from "@/app/styles/bloc.module.scss";

type ItemsByCategoryTypes = {
    categoryName: string;
    category: CategorieItem;
};

export default function ItemsByCategory({
    categoryName,
    category

}: ItemsByCategoryTypes) {
    return (
        <div className={styles.category_content}>
            <h3 className={styles.category_name}>{categoryName}</h3>
            <li className={styles.modeles_preview}>
                {category.modeles.slice(0, 3).map((modele) => (
                    <span key={modele.id} className={styles.modele_tag}>
                        {modele.nom}: {modele.quantite}
                    </span>
                ))}
                {category.modeles.length > 3 && (
                    <span className={styles.modele_more}>+{category.modeles.length - 3}</span>
                )}
            </li>
        </div>
    )
};