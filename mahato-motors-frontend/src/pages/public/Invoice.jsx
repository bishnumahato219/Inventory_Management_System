import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

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
        alert("Invoice not available");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: 40, textAlign: "center" }}>Loading modern invoice...</p>;
  if (!data) return <p style={{ padding: 40, textAlign: "center" }}>No data found for this invoice.</p>;

  // SCHEMA DATA BINDING
  const exShowroom = Number(data.car?.exShowroomPrice) || 0; 
  const onRoadTotal = Number(data.car?.onRoadPrice) || 0;
  
  // Calculate additional costs (Registration, Insurance, Handling, etc.)
  const additionalCosts = onRoadTotal - exShowroom;

  const invoiceNo = data.invoiceNumber || "INV-" + id.slice(-5).toUpperCase();
  const issueDate = data.deliveryDate 
    ? new Date(data.deliveryDate).toLocaleDateString('en-IN') 
    : new Date().toLocaleDateString('en-IN');

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", padding: "20px 0" }}>
      
      <style>
        {`
          @media print {
            @page { size: A4; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact; }
            body * { visibility: hidden; }
            .invoice-wrapper, .invoice-wrapper * { visibility: visible; }
            
            .invoice-wrapper {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 40px !important;
              box-shadow: none !important;
              overflow: hidden; 
            }
            .print-btn { display: none !important; }
          }
        `}
      </style>

      <div
        className="invoice-wrapper"
        style={{
          width: "850px",
          margin: "0 auto",
          background: "white",
          padding: "60px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          color: "#1a1a1a"
        }}
      >
        {/* TOP ACCENT */}
        <div style={{ height: "6px", background: "linear-gradient(90deg, #8277a7 0%, #a29bfe 100%)", marginBottom: "40px" }}></div>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "50px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>MAHATO MOTORS</h1>
            <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>Authorized Maruti Suzuki Dealership</p>
            <div style={{ marginTop: "15px", fontSize: "13px", color: "#888", lineHeight: "1.5" }}>
              1234 Main Street, Suite 100<br />
              Kolkata, WB 700001<br />
              T: +91 98765 43210
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, fontSize: "42px", fontWeight: "300", color: "#8277a7" }}>INVOICE</h2>
            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <p style={{ margin: "2px 0" }}><strong>Invoice:</strong> #{invoiceNo}</p>
              <p style={{ margin: "2px 0" }}><strong>Date:</strong> {issueDate}</p>
              <p style={{ margin: "2px 0" }}><strong>Status:</strong> <span style={{ color: "#8277a7", fontWeight: "bold" }}>PAID</span></p>
            </div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div style={{ display: "flex", marginBottom: "50px", borderTop: "1px solid #eee", paddingTop: "30px" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", color: "#8277a7", marginBottom: "12px", letterSpacing: "1px" }}>Customer Details</h3>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>{data.customer?.name || "Valued Customer"}</p>
            <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>{data.customer?.phone}</p>
            <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>{data.customer?.email}</p>
          </div>
          <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: "11px", textTransform: "uppercase", color: "#8277a7", marginBottom: "12px", letterSpacing: "1px" }}>Vehicle Details</h3>
             <p style={{ margin: "0", fontSize: "14px" }}><strong>Model:</strong> {data.car?.modelName}</p>
             <p style={{ margin: "4px 0", fontSize: "14px" }}><strong>Variant:</strong> {data.car?.variant}</p>
             <p style={{ margin: "0", fontSize: "14px" }}><strong>Specs:</strong> {data.car?.fuelType} | {data.car?.color}</p>
          </div>
        </div>

        {/* PRICING TABLE */}
        <table width="100%" style={{ borderCollapse: "collapse", marginBottom: "40px" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f8f9fa" }}>
              <th style={{ padding: "15px", fontSize: "12px", textTransform: "uppercase", color: "#666", borderBottom: "2px solid #eee" }}>Description</th>
              <th style={{ padding: "15px", fontSize: "12px", textTransform: "uppercase", color: "#666", borderBottom: "2px solid #eee", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "25px 15px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>Ex-Showroom Price</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Base vehicle cost for {data.car?.modelName} (SKU: {data.car?.sku})</div>
              </td>
              <td style={{ padding: "25px 15px", borderBottom: "1px solid #f0f0f0", textAlign: "right", fontWeight: "600" }}>
                ₹{exShowroom.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "25px 15px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>Additional Costs</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Registration, Insurance, RTO, and Taxes</div>
              </td>
              <td style={{ padding: "25px 15px", borderBottom: "1px solid #f0f0f0", textAlign: "right", fontWeight: "600" }}>
                ₹{additionalCosts.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* TOTALS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ maxWidth: "40%" }}>
            <h4 style={{ fontSize: "12px", color: "#8277a7", textTransform: "uppercase", marginBottom: "10px" }}>Company Disclaimer</h4>
            <p style={{ fontSize: "12px", color: "#777", lineHeight: "1.6", margin: 0 }}>
              This invoice confirms the final On-Road price for the vehicle. 
              Barcode: {data.car?.barcode}.
            </p>
          </div>
          <div style={{ width: "320px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <span style={{ fontSize: "14px", color: "#666" }}>Ex-Showroom</span>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>₹{exShowroom.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "2px solid #1a1a1a" }}>
              <span style={{ fontSize: "14px", color: "#666" }}>Add. Charges</span>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>₹{additionalCosts.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "25px 0", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: "800" }}>ON-ROAD TOTAL</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#8277a7" }}>₹{onRoadTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "60px", textAlign: "center", borderTop: "1px solid #eee", paddingTop: "30px" }}>
          <p style={{ fontSize: "18px", color: "#8277a7", fontWeight: "300", margin: 0 }}>Safe Travels from Mahato Motors!</p>
          <p style={{ fontSize: "11px", color: "#aaa", marginTop: "10px" }}>Computer Generated Invoice • No Signature Required</p>
        </div>

        <div className="print-btn" style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "14px 40px",
              background: "#1a1a1a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;