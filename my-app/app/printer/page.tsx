"use client";

import { useState } from "react";
import { FaDownload, FaFileExport, FaHome } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import styles from "../styles/print.module.scss";

export default function PrinterPage() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      // Récupérer les données depuis l'API
      const response = await fetch('/api/inventory');
      const data = await response.json();
      
      // Convertir en chaîne JSON formatée
      const jsonString = JSON.stringify(data, null, 2);
      
      // Créer un blob et télécharger
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Export JSON réussi !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      
      // Convertir les données en CSV
      const csvRows = [];
      
      // En-têtes
      csvRows.push(['Bloc', 'Etage', 'Categorie', 'Modele', 'Quantite']);
      
      // Parcourir les données
      for (const bloc of data.blocs) {
        for (const etage of bloc.etages) {
          for (const categorie of etage.categories) {
            for (const modele of categorie.modeles) {
              csvRows.push([
                bloc.nom,
                etage.nom,
                categorie.nom,
                modele.nom,
                modele.quantite
              ]);
            }
          }
        }
      }
      
      // Convertir en chaîne CSV
      const csvString = csvRows.map(row => row.join(',')).join('\n');
      
      // Télécharger
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Export CSV réussi !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      
      // Créer un tableau HTML pour Excel
      let htmlContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Inventaire</title>
            <style>
              th { background-color: #4CAF50; color: white; padding: 8px; }
              td { border: 1px solid #ddd; padding: 8px; }
              table { border-collapse: collapse; width: 100%; }
            </style>
          </head>
          <body>
            <h1>Inventaire - ${new Date().toLocaleDateString()}</h1>
            <table>
              <thead>
                <tr><th>Bloc</th><th>Etage</th><th>Catégorie</th><th>Modèle</th><th>Quantité</th></tr>
              </thead>
              <tbody>
      `;
      
      for (const bloc of data.blocs) {
        for (const etage of bloc.etages) {
          for (const categorie of etage.categories) {
            for (const modele of categorie.modeles) {
              htmlContent += `
                <tr>
                  <td>${bloc.nom}</td>
                  <td>${etage.nom}</td>
                  <td>${categorie.nom}</td>
                  <td>${modele.nom}</td>
                  <td>${modele.quantite}</td>
                </tr>
              `;
            }
          }
        }
      }
      
      htmlContent += `
              </tbody>
            </table>
            <p>Exporté le ${new Date().toLocaleString()}</p>
          </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Export Excel réussi !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtn}>

        <h1>Export de la database</h1>

        <button onClick={() => router.push("/")} className={styles.btn_home}>
          <FaHome size={32} />
        </button>
      </div>

      <div className={styles.container_print}>
        
        <div className={styles.container_box}>

          <div className={styles.export_container}>
            <p className={styles.export_description}>
              Choisissez le format d&apos;exportation pour sauvegarder votre inventaire
            </p>

            <div className={styles.export_buttons}>
              <button
                onClick={exportToJSON}
                disabled={isExporting}
                className={styles.export_btn_json}
              >
                <FaFileExport /> JSON
                <small>Format natif, réutilisable</small>
              </button>

              <button
                onClick={exportToCSV}
                disabled={isExporting}
                className={styles.export_btn_csv}
              >
                <FaDownload /> CSV
                <small>Compatible Excel/Tableur</small>
              </button>

              <button
                onClick={exportToExcel}
                disabled={isExporting}
                className={styles.export_btn_excel}
              >
                <FaDownload /> Excel
                <small>Format XLS lisible</small>
              </button>
            </div>

            <div className={styles.export_info}>
              <h3>Recommandation :</h3>
              <ul>
                <li><strong>JSON</strong> → Pour réimporter plus tard dans l&apos;application</li>
                <li><strong>CSV</strong> → Pour ouvrir dans Excel, Google Sheets ou LibreOffice</li>
                <li><strong>Excel (HTML)</strong> → Pour une lecture directe avec mise en forme</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}