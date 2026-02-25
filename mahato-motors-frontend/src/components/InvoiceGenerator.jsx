import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceGenerator({ sale }) {

  const generatePDF = async () => {
    const input = document.getElementById("invoice");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
    pdf.save(`Invoice-${sale.invoiceNumber}.pdf`);
  };

  return (
    <div>
      <div id="invoice" className="p-6 bg-white">
        <h2 className="text-xl font-bold">
          Invoice #{sale.invoiceNumber}
        </h2>
        <p>Customer: {sale.customer?.name}</p>
        <p>Car: {sale.car?.modelName}</p>
        <p>Price: ₹{sale.salePrice}</p>
        <p>Payment: {sale.paymentMode}</p>
      </div>

      <button
        onClick={generatePDF}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Download Invoice
      </button>
    </div>
  );
}