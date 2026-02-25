import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Download, FileText, Search, TrendingUp, History } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

const SalesHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Ensure backend uses .populate('customer').populate('car')
      const res = await API.get("/sales/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Ledger Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = (item) => {
    try {
      const doc = new jsPDF();
      
      // 1. Futuristic Brand Header
      doc.setFontSize(24);
      doc.setTextColor(255, 102, 0); // Brand Orange
      doc.text("MAHATO MOTORS", 14, 20);
      
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Authorized Maruti Suzuki Premium Dealership", 14, 28);
      doc.setFont("helvetica", "bold");
      doc.text(`INVOICE: ${item.invoiceNumber || 'N/A'}`, 14, 36);
      doc.setFont("helvetica", "normal");
      doc.text(`DATE: ${new Date(item.saleDate).toLocaleDateString()}`, 14, 42);

      // 2. Structural Details Table
      autoTable(doc, {
        startY: 50,
        head: [["Technical Specification", "Detailed Information"]],
        body: [
          ["Customer Identity", item.customer?.name || "Corporate Sale"],
          ["Registered Phone", item.customer?.phone || "N/A"],
          ["Vehicle Architecture", item.car?.modelName || "N/A"],
          ["Variant Configuration", item.car?.variant || "N/A"],
          ["Propulsion Type", item.car?.fuelType || "N/A"],
          ["Exterior Finish", item.car?.color || "N/A"],
          ["Transaction Mode", item.paymentMode || "Direct Transfer"],
          ["Total Valuation", `INR ${item.salePrice?.toLocaleString("en-IN")}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], fontSize: 11 }, // Slate-900
        styles: { fontSize: 10, cellPadding: 6 },
        columnStyles: { 0: { fontStyle: 'bold', fillColor: [250, 250, 250] } }
      });

      // 3. Futuristic Footer
      const finalY = doc.lastAutoTable.finalY + 25;
      doc.setFontSize(10);
      doc.setTextColor(30);
      doc.text("Digital Verification Authorized", 14, finalY);
      doc.setDrawColor(255, 102, 0);
      doc.line(14, finalY + 2, 70, finalY + 2);
      doc.setFontSize(8);
      doc.text("This is a computer-generated invoice for Mahato Motors.", 14, finalY + 12);

      doc.save(`Mahato_Invoice_${item.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("System Error: PDF module failed. Check library installation.");
    }
  };

  const filteredHistory = history.filter(item => 
    item.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col h-64 items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Sales Ledger...</p>
    </div>
  );

  return (
    <div className="p-4 space-y-10">
      {/* Header with Visual KPI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            Sales <span className="text-orange-600">Intelligence</span> <TrendingUp className="text-orange-500" />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Full transaction history and automated invoice retrieval.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Invoices..."
            className="w-full md:w-80 pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Futuristic Data Grid */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-8">Transaction Hub</th>
              <th className="p-8">Asset & Client</th>
              <th className="p-8 text-center">Valuation</th>
              <th className="p-8 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredHistory.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-all group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                      <History size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{item.invoiceNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.saleDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{item.customer?.name || "Private Entry"}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-black uppercase tracking-widest">{item.car?.modelName}</span>
                      <span className="text-[10px] text-slate-300 font-bold">• {item.car?.variant}</span>
                    </div>
                  </div>
                </td>
                <td className="p-8 text-center">
                  <p className="text-lg font-black text-slate-900">₹{item.salePrice?.toLocaleString("en-IN")}</p>
                  <span className="text-[9px] font-black text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    {item.paymentMode}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <button 
                    onClick={() => generateInvoice(item)}
                    className="inline-flex items-center gap-3 bg-slate-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    <Download size={14} /> Generate Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredHistory.length === 0 && (
          <div className="p-32 text-center flex flex-col items-center gap-4">
            <div className="p-6 bg-slate-50 rounded-full">
              <FileText className="text-slate-200" size={48} />
            </div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No matching ledger entries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;