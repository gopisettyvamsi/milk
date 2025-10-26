import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import UserLayout from './layouts/UserLayout';

interface PaymentRecord {
  payment_id: number;
  user_id: number;
  event_id: number;
  order_id: string;
  transaction_id: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  amount: number;
  created_date: string;
  event_title: string;
  user_name: string;
  user_email: string;
}

const PaymentsHistory: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 5;

  const { data: session } = useSession();
  const loggedInEmail = session?.user?.email || "";

  useEffect(() => {
    const fetchPayments = async () => {
      if (!loggedInEmail) return;
      const response = await fetch('/api/payments');
      const data = await response.json();

      // Filter only records matching the logged-in user's email
      const filtered = data.filter(
        (payment: PaymentRecord) => payment.user_email === loggedInEmail
      );

      setPaymentData(filtered);
    };
    fetchPayments();
  }, [loggedInEmail]);

  const totalPages = Math.ceil(paymentData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = paymentData.slice(startIndex, endIndex);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: PaymentRecord['payment_status']): string => {
    const statusClasses = {
      SUCCESS: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
      REFUNDED: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return statusClasses[status];
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <UserLayout>
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p className="text-gray-600">Track all your event enrollments and payment status</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Enrolled Event</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRecords.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.payment_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{payment.event_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="font-medium">{payment.event_title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="font-medium">{payment.transaction_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.payment_status)}`}>
                      {payment.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No payment records found</div>
            <p className="text-gray-500">Your payment history will appear here once you enroll in events.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
              {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, paymentData.length)} of {paymentData.length} results
              </span>
            </div>
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}

      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <div>Total Records: {paymentData.length}</div>
        <div className="flex space-x-4">
          <span>
            Total Paid:{" "}
            <span className="font-semibold text-gray-900">
              {formatCurrency(
                paymentData.reduce((sum, payment) => {
                  const amt = Number(payment.amount); // convert string to number
                  return sum + (payment.payment_status === "SUCCESS" ? amt : 0);
                }, 0)
              )}
            </span>
          </span>
        </div>

      </div>
    </div>
    </UserLayout>
  );
};

export default PaymentsHistory;
