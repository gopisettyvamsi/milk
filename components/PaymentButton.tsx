"use client";
import { ArrowRight, CheckCircle, Clock, CreditCard, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING" | null;
interface PaymentDetails {
  order_id: string;
  transaction_id: string;
}

export default function PaymentButton({
  id,
  user_id,
  event_id,
  amount,
  user_name,
  user_email,
  event_title,
  onSuccess,
  onCancel,
}: {
  id?: string;
  user_id: number;
  event_id: number;
  amount: number;
  user_name: string;
  user_email: string;
  event_title: string;
  onSuccess?: () => void; // ✅ Added optional callbacks
  onCancel?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const paymentProcessedRef = useRef(false);

// 🧩 Trigger pending mail when user closes tab/window during payment
useEffect(() => {
  const handleBeforeUnload = async () => {
    // ✅ Only trigger when order created but not finalized
    if (
      currentOrderId && 
      !paymentProcessedRef.current && 
      (paymentStatus === null || paymentStatus === "PENDING")
    ) {
      try {
        // Update DB to pending
        await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: currentOrderId,
            status: "PENDING",
            razorpay_payment_id: "N/A",
          }),
        });

        // Send pending mail
        await fetch("/api/payments/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user_email,
            name: user_name,
            event_title,
            amount,
            order_id: currentOrderId,
            transaction_id: "N/A",
            payment_status: "PENDING",
          }),
        });

        console.log("📩 Pending mail triggered on browser close during payment");
      } catch (err) {
        console.error("❌ Error sending pending mail on unload:", err);
      }
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [paymentStatus, currentOrderId]);



  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    paymentProcessedRef.current = false;

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, user_id, event_id }),
      });

      const order = await res.json();
      if (!order.orderId) throw new Error("Order creation failed");

      setCurrentOrderId(order.orderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Organization Events",
        description: "Event Ticket Payment",
        order_id: order.orderId,
        handler: async (response: any) => {
          if (paymentProcessedRef.current) return;
          paymentProcessedRef.current = true;
          await handleSuccess(response);
        },
        modal: {
          ondismiss: async () => {
            if (!paymentProcessedRef.current) {
              await markPending(order.orderId);
              if (onCancel) onCancel(); // ✅ Trigger cancel callback on modal close
            }
          },
        },
        prefill: { name: user_name, email: user_email, contact: "9999999999" },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async () => {
        if (!paymentProcessedRef.current) {
          paymentProcessedRef.current = true;
          await handleFailure(order.orderId);
        }
      });

      rzp.open();

      timeoutIdRef.current = setTimeout(() => {
        if (!paymentProcessedRef.current) {
          setLoading(false);
          setPaymentStatus("PENDING");
          setShowPopup(true);
        }
      }, 15000);
    } catch (err) {
      console.error("Payment error:", err);
      await handleFailure(currentOrderId || "");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (response: any) => {
    clearTimer();
    try {
      const verify = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          status: "SUCCESS",
        }),
      });

      if (verify.ok) {
        await sendEmail("SUCCESS", {
          order_id: response.razorpay_order_id,
          transaction_id: response.razorpay_payment_id,
        });
        setPaymentStatus("SUCCESS");
        if (onSuccess) onSuccess(); // ✅ Call success callback
      } else {
        await handleFailure(response.razorpay_order_id);
        return;
      }
    } catch {
      await handleFailure(response.razorpay_order_id);
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  const handleFailure = async (orderId: string) => {
    clearTimer();
    try {
      await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpay_order_id: orderId, status: "FAILED" }),
      });
      await sendEmail("FAILED", { order_id: orderId, transaction_id: "N/A" });
      setPaymentStatus("FAILED");
      if (onCancel) onCancel(); // ✅ Trigger cancel callback on failure
    } catch (err) {
      console.error("Failure handler error:", err);
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  const markPending = async (orderId: string) => {
    clearTimer();
    try {
      await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpay_order_id: orderId, status: "PENDING" }),
        keepalive: true,
      });
      await sendEmail("PENDING", { order_id: orderId, transaction_id: "N/A" });
      setPaymentStatus("PENDING");
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  const sendEmail = async (status: string, details: PaymentDetails) => {
    await fetch("/api/payments/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user_email,
        name: user_name,
        event_title,
        amount,
        order_id: details.order_id,
        transaction_id: details.transaction_id,
        payment_status: status,
      }),
    });
  };

  const clearTimer = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  return (
    <>
      {paymentStatus === null && (
        <button
          id={id}
          onClick={handlePayment}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-lg font-medium shadow-md transition-colors duration-200"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Click here to pay</span>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </>
          )}
        </button>
      )}

      {showPopup && (
        <div className="mt-4 p-4 rounded-lg shadow-md border border-gray-200 text-center flex flex-col items-center gap-2">
          {paymentStatus === "SUCCESS" && (
            <div className="flex flex-col items-center text-green-600">
              <CheckCircle className="w-8 h-8 mb-1" />
              <p className="font-semibold text-lg">Payment Successful!</p>
            </div>
          )}

          {paymentStatus === "FAILED" && (
            <div className="flex flex-col items-center text-red-600">
              <XCircle className="w-8 h-8 mb-1" />
              <p className="font-semibold text-lg">Payment Failed!</p>
            </div>
          )}

          {paymentStatus === "PENDING" && (
            <div className="flex flex-col items-center text-yellow-600">
              <Clock className="w-8 h-8 mb-1" />
              <p className="font-semibold text-lg">Payment Processing...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
