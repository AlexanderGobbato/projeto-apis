"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  projeto: {
    nome_projeto: string;
    server: string | null;
    url_base: string | null;
    git_url: string | null;
    anotacoes: string | null;
    scopes: { identificador_scope: string }[];
    recursos: {
      id: string;
      metodo: string;
      path: string;
      procedure_transacao: string | null;
      request: string | null;
      response: string | null;
      publicado_dev: boolean;
      publicado_hml: boolean;
      publicado_prd: boolean;
    }[];
  };
}

export default function ExportButtons({ projeto }: ExportButtonsProps) {
  const handleExportExcel = () => {
    const scopesStr = projeto.scopes.map((s) => s.identificador_scope).join(", ");

    const data = projeto.recursos.map((rec) => ({
      "Projeto Name": projeto.nome_projeto,
      "Base URL": projeto.url_base || "",
      "Git Repository": projeto.git_url || "",
      "Project Scopes": scopesStr,
      "Method": rec.metodo,
      "Path": rec.path,
      "Procedure/Transação": rec.procedure_transacao || "",
      "Request (JSON)": rec.request || "",
      "Response (JSON)": rec.response || "",
      "Deploy DEV": rec.publicado_dev ? "SIM" : "NÃO",
      "Deploy HML": rec.publicado_hml ? "SIM" : "NÃO",
      "Deploy PRD": rec.publicado_prd ? "SIM" : "NÃO",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resources");

    // Setting column widths
    const maxWidths = [20, 30, 30, 20, 10, 30, 20, 40, 40, 12, 12, 12];
    worksheet["!cols"] = maxWidths.map((w) => ({ wch: w }));

    XLSX.writeFile(workbook, `projeto-${projeto.nome_projeto.toLowerCase()}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    const scopesStr = projeto.scopes.map((s) => s.identificador_scope).join(", ");

    // Header
    doc.setFontSize(22);
    doc.setTextColor(31, 31, 31);
    doc.text(`Projeto: ${projeto.nome_projeto}`, 40, 40);

    doc.setFontSize(10);
    doc.setTextColor(95, 99, 104);
    doc.text(`URL Base: ${projeto.url_base || "N/A"}`, 40, 60);
    doc.text(`Git: ${projeto.git_url || "N/A"}`, 40, 75);
    doc.text(`Scopes: ${scopesStr || "N/A"}`, 40, 90);

    const tableData = projeto.recursos.map((rec) => [
      rec.metodo,
      rec.path,
      rec.procedure_transacao || "-",
      `${rec.publicado_dev ? "D " : ""}${rec.publicado_hml ? "H " : ""}${rec.publicado_prd ? "P" : ""}` || "-",
      rec.request ? "Sim" : "Não",
      rec.response ? "Sim" : "Não",
    ]);

    autoTable(doc, {
      startY: 110,
      head: [["Método", "Path", "Proc/Trans", "Deploy", "Req", "Res"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [26, 115, 232], textColor: 255, fontSize: 10, fontStyle: "bold" },
      bodyStyles: { fontSize: 9, textColor: 31 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: 40, right: 40 },
    });

    doc.save(`projeto-${projeto.nome_projeto.toLowerCase()}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportExcel}
        className="flex items-center gap-2 bg-[#1e8e3e] hover:bg-[#137333] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Exportar Excel
      </button>

      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 bg-[#d93025] hover:bg-[#b31412] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Exportar PDF
      </button>
    </div>
  );
}
