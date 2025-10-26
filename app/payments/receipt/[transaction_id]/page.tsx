"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";

interface Receipt {
  order_id: string;
  transaction_id: string;
  amount: number;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
  payment_date: string;
  event_title: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export default function ReceiptPage() {
  const { transaction_id } = useParams();
  const [data, setData] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false); // ✅ New loader for PDF

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/payments/receipt/${transaction_id}`);
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
      } finally {
        setLoading(false);
      }
    };
    if (transaction_id) fetchReceipt();
  }, [transaction_id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading receipt...
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Receipt not found.
      </div>
    );

  const statusStyle = {
    SUCCESS: { icon: <CheckCircle className="text-green-600" size={26} />, text: "text-green-700" },
    FAILED: { icon: <XCircle className="text-red-600" size={26} />, text: "text-red-700" },
    PENDING: { icon: <Clock className="text-yellow-600" size={26} />, text: "text-yellow-700" },
    REFUNDED: { icon: <Clock className="text-blue-600" size={26} />, text: "text-blue-700" },
  }[data.payment_status];

const handlePrintPDF = async () => {
  setPdfLoading(true); // ✅ Show loader

  try {
    const pdfUrl = `/api/payments/receipt/${data.transaction_id}/pdf`;
    const response = await fetch(pdfUrl);

    if (!response.ok) throw new Error("Failed to generate PDF");

    // Convert to blob
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `receipt-${data.transaction_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate receipt PDF. Please try again.");
  } finally {
    setPdfLoading(false); // ✅ Hide loader
  }
};


  return (
    <UserLayout>
      {/* ✅ Loader Overlay */}
      {pdfLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-3">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">Generating PDF receipt...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-4">{statusStyle.icon}</div>
          <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800">
            Payment {data.payment_status === "SUCCESS" ? "Successful" : data.payment_status}
          </h2>
          <p className="text-center text-gray-500 mb-6">{data.payment_date}</p>

          <div className="border-t border-gray-200 pt-4 text-gray-700">
            <p className="flex justify-between py-2">
              <span>Event:</span> <strong>{data.event_title}</strong>
            </p>
            <p className="flex justify-between py-2">
              <span>Amount:</span> <strong>₹{data.amount}</strong>
            </p>
            <p className="flex justify-between py-2">
              <span>Transaction ID:</span> <span>{data.transaction_id}</span>
            </p>
            <p className="flex justify-between py-2">
              <span>Order ID:</span> <span>{data.order_id}</span>
            </p>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 text-gray-700 text-sm">
            <p>Paid by: {data.user_name}</p>
            <p>Email: {data.user_email}</p>
          </div>

          {/* <div className="text-center mt-6 flex justify-center gap-4">
            <button
              onClick={handlePrintPDF}
              disabled={pdfLoading}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition ${
                pdfLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {pdfLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  Save PDF
                </>
              )}
            </button>

            <a
              href="/user/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Back
            </a>
          </div> */}
        </div>
      </div>
    </UserLayout>
  );
}
