import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { Printer, Download, Car, User, MapPin } from "lucide-react";

const Invoice = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/bookings/${id}/invoice`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Invoice fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Generating Audit-Ready Invoice...</p>
      </div>
    </div>
  );

  if (!data) return <p className="p-20 text-center font-bold text-slate-400">Registry Error: Invoice Data Missing.</p>;

  const exShowroom = Number(data.car?.exShowroomPrice) || 0;
  const onRoadTotal = Number(data.car?.onRoadPrice) || 0;
  const additionalCosts = onRoadTotal - exShowroom;
  const invoiceNo = data.invoiceNumber || "INV-" + id.slice(-5).toUpperCase();
  const issueDate = data.deliveryDate 
    ? new Date(data.deliveryDate).toLocaleDateString('en-IN') 
    : new Date().toLocaleDateString('en-IN');

  return (
    <div className="bg-slate-100 min-h-screen py-0 md:py-10 print:bg-white print:py-0">
      
      {/* 1. PRINT PROTOCOLS */}
      <style>
        {`
          @media print {
            @page { size: A4; margin: 1cm; }
            body { background: white; }
            .no-print { display: none !important; }
            .invoice-card { 
              box-shadow: none !important; 
              border: none !important; 
              width: 100% !important; 
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        `}
      </style>

      {/* 2. ACTIONS BAR (Hidden on Print) */}
      <div className="max-w-[850px] mx-auto mb-6 px-4 no-print flex justify-between items-center pt-6 md:pt-0">
        <button 
          onClick={() => window.history.back()}
          className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-orange-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-orange-600 transition-all active:scale-95"
        >
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* 3. MAIN INVOICE CARD */}
      <div className="invoice-card max-w-[850px] mx-auto bg-white shadow-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-200">
        
        {/* Branding Accent */}
        <div className="h-3 bg-gradient-to-r from-slate-900 via-orange-600 to-orange-500"></div>

        <div className="p-8 md:p-16">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Mahato <span className="text-orange-600">Motors.</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorized Maruti Suzuki Dealer</p>
              <div className="mt-6 text-xs text-slate-500 space-y-1 font-medium">
                <p className="flex items-center gap-2"><MapPin size={12} /> NH-33, Gandhinagar Area, Haldia</p>
                <p>West Bengal, India - 721158</p>
                <p>GSTIN: 19AAACM1234F1Z5</p>
              </div>
            </div>
            <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
              <h2 className="text-5xl md:text-7xl font-black text-slate-100 uppercase leading-none mb-4 hidden md:block">INVOICE</h2>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">ID: <span className="font-mono text-slate-500">#{invoiceNo}</span></p>
                <p className="text-xs font-bold text-slate-900">DATE: <span className="text-slate-500">{issueDate}</span></p>
                <div className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100 mt-2">
                  Payment Status: Confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Parties Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-y border-slate-100 mb-12">
            <div>
              <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <User size={12} /> Billed To
              </h3>
              <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{data.customer?.name || "N/A"}</p>
              <div className="text-xs text-slate-500 font-medium mt-2 space-y-1">
                <p>{data.customer?.email}</p>
                <p>{data.customer?.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Car size={12} /> Asset Details
              </h3>
              <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{data.car?.modelName}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{data.car?.variant} | {data.car?.fuelType}</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="p-5">Operational Item</th>
                  <th className="p-5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-5">
                    <p className="font-black text-slate-800 text-sm uppercase">Ex-Showroom Price</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Base unit cost for {data.car?.modelName}</p>
                  </td>
                  <td className="p-5 text-right font-black text-slate-800 text-sm">
                    ₹{exShowroom.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td className="p-5">
                    <p className="font-black text-slate-800 text-sm uppercase">Ancillary Charges</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Registration, Insurance, RTO & Logistics</p>
                  </td>
                  <td className="p-5 text-right font-black text-slate-800 text-sm">
                    ₹{additionalCosts.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total Footer */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-xs text-left w-full md:w-auto order-2 md:order-1">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Disclaimer & Terms</h4>
              <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic uppercase">
                This document serves as the final commercial settlement for asset identification {data.car?.barcode}. 
                No manual signature is required as this is an electronically verified record.
              </p>
            </div>
            <div className="w-full md:w-80 order-1 md:order-2">
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase">Sub-Total</span>
                <span className="text-sm font-bold text-slate-600">₹{exShowroom.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-slate-900">
                <span className="text-[10px] font-black text-slate-400 uppercase">Ancillary Total</span>
                <span className="text-sm font-bold text-slate-600">₹{additionalCosts.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-6 items-center">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">On-Road Total</span>
                <span className="text-3xl font-black text-orange-600">₹{onRoadTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Visual Footer */}
          <div className="mt-16 pt-8 border-t border-slate-50 text-center">
            <p className="text-lg font-black text-slate-200 uppercase tracking-[0.3em]">Mahato Motors Haldia</p>
            <p className="text-[8px] text-slate-300 font-bold uppercase mt-2">© 2026 Audit Sequence Finalized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;