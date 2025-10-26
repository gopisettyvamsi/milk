"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, Clock } from "lucide-react";

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

export default function PrintableReceipt() {
  const { transaction_id } = useParams();
  const [data, setData] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/payments/receipt/${transaction_id}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      setLoading(false);
    };
    if (transaction_id) load();
  }, [transaction_id]);

  if (loading)
    return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
  if (!data)
    return <div className="flex items-center justify-center min-h-screen">Receipt not found.</div>;

  const status = {
    SUCCESS: { icon: <CheckCircle className="text-green-600" />, text: "Success" },
    FAILED: { icon: <XCircle className="text-red-600" />, text: "Failed" },
    PENDING: { icon: <Clock className="text-yellow-600" />, text: "Pending" },
    REFUNDED: { icon: <Clock className="text-blue-600" />, text: "Refunded" },
  }[data.payment_status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-10 px-6">
      <div className="border border-gray-300 rounded-lg p-8 w-full max-w-md shadow-none">
        <div className="flex justify-center mb-3">{status.icon}</div>
        <h2 className="text-xl font-semibold text-center mb-1">Payment {status.text}</h2>
        <p className="text-center text-gray-500 mb-4">{data.payment_date}</p>
        <hr className="mb-4" />
        <p className="flex justify-between py-1"><span>Event</span><strong>{data.event_title}</strong></p>
        <p className="flex justify-between py-1"><span>Amount</span><strong>₹{data.amount}</strong></p>
        <p className="flex justify-between py-1"><span>Transaction ID</span>{data.transaction_id}</p>
        <p className="flex justify-between py-1"><span>Order ID</span>{data.order_id}</p>
        <hr className="mt-4 mb-2" />
        <p className="text-sm">Paid by: {data.user_name}</p>
        <p className="text-sm">Email: {data.user_email}</p>
      </div>
      <style jsx global>{`
        @page { margin: 0; }
        @media print {
          body { background: white; margin: 0; }
        }
      `}</style>
    </div>
  );
}
