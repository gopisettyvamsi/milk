'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, X, Filter, Download, CreditCard, RefreshCw, ChevronDown, TrendingUp, Calendar } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useSession } from 'next-auth/react';
import AnimatedNumber from '@/components/AnimatedNumber';


interface PaymentRecord {
    payment_id: number;
    user_id: number;
    user_name: string;
    event_id: number;
    event_name: string;
    order_id: string;
    transaction_id: string;
    amount: number;
    payment_status: string;
    created_date: string;
}

interface EventOption {
    id: number;
    event_title: string;
}

interface PaginationParams {
    page: number;
    limit: number;
    total: number;
}

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        limit: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalReceived, setTotalReceived] = useState<number>(0);
    const [pageTotal, setPageTotal] = useState<number>(0);
    const [filtersExpanded, setFiltersExpanded] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedEventRow, setExpandedEventRow] = useState<number | null>(null);

    const { data: session, status } = useSession();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        const role = session?.user?.role;
        if (role === "hr" || role === "admin" || role === "super_admin") {
            setAuthorized(true);
        } else {
            setAuthorized(false);
            setIsLoading(false);
        }
    }, [session, status]);

    const fetchAllEvents = async () => {
        try {
            const res = await fetch('/api/admin/payment-history?list=events');
            const data = await res.json();
            if (data.success) setEventOptions(data.data);
        } catch (err) {
            console.error('Error fetching event list:', err);
        }
    };

    const fetchPayments = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const params = new URLSearchParams({
                user: userFilter,
                event: selectedEvent,
                status: statusFilter,
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            const res = await fetch(`/api/admin/payment-history?${params}`);
            const data = await res.json();

            if (data.success) {
                setPayments(data.data);
                setPagination((prev) => ({
                    ...prev,
                    total: data.pagination?.total || 0,
                }));
                setTotalReceived(data.totals?.totalRevenue || 0);
                setPageTotal(data.totals?.pageRevenue || 0);
            } else {
                setError('Failed to load payment history');
            }
        } catch (err) {
            console.error('Error fetching payment history:', err);
            setError('An error occurred while loading data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userFilter, selectedEvent, statusFilter, pagination.page, pagination.limit]);


    useEffect(() => {
        fetchAllEvents();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => fetchPayments(), 300);
        return () => clearTimeout(delay);
    }, [userFilter, selectedEvent, statusFilter, pagination.page, fetchPayments]);

    const clearFilters = () => {
        setUserFilter('');
        setSelectedEvent('');
        setStatusFilter('');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleRefresh = () => {
        fetchPayments(true);
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setPagination((prev) => ({ ...prev, page }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLimitChange = (newLimit: number) => {
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const exportToCSV = () => {
        const headers = [
            'User Name',
            'User ID',
            'Event Name',
            'Event ID',
            'Order ID',
            'Transaction ID',
            'Amount',
            'Payment Status',
            'Transaction Date',
        ];

        const rows = payments.map((item) => [
            item.user_name,
            item.user_id,
            item.event_name,
            item.event_id,
            item.order_id,
            item.transaction_id,
            item.amount,
            item.payment_status,
            new Date(item.created_date).toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
        ]);

        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const activeFiltersCount = [userFilter, selectedEvent, statusFilter].filter(Boolean).length;

    const truncateEventName = (name: string, maxLength: number = 30) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    };

    useEffect(() => {
        if (authorized) {
            fetchPayments();
        }
    }, [authorized, fetchPayments]);
    if (authorized === false) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p className="text-center text-red-600 p-10 text-lg font-semibold">
                    Unauthorized access. You do not have permission to view this page.
                </p>
            </div>
        );
    }


    return (<>
    {/* Desktop */}
        <div className='hidden sm:block'>
<AdminLayout>
            <div className=" px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
                <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
                    <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
                        Home
                    </a>{" "}
                    / <span className="text-gray-700">Payments</span>
                </nav>
            </div>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                    <button
                        onClick={() => setFiltersExpanded(!filtersExpanded)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-800">Filters</h3>
                            {activeFiltersCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFilters();
                                    }}
                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    <X className="w-4 h-4" /> Clear All
                                </button>
                            )}
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {filtersExpanded && (
                        <div className="p-6 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Search by User
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            placeholder="Enter user name..."
                                            value={userFilter}
                                            onChange={(e) => setUserFilter(e.target.value)}
                                            className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        {userFilter && (
                                            <button
                                                onClick={() => setUserFilter('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Filter by Event
                                    </label>
                                    <select
                                        value={selectedEvent}
                                        onChange={(e) => setSelectedEvent(e.target.value)}
                                        className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all"
                                    >
                                        <option value="">All Events</option>
                                        {eventOptions.map((ev) => (
                                            <option key={ev.id} value={ev.id.toString()}>
                                                {ev.event_title}
                                            </option>

                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Payment Status
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="SUCCESS">Success</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="FAILED">Failed</option>
                                        <option value="REFUNDED">Refunded</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Table Section */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg p-12">
                        <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading payment records...</p>
                        </div>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12">
                        <div className="text-center">
                            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No payment records found</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Export Button */}
                            {/* <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                                <p className="text-sm text-gray-600 font-medium">
                                    Showing {payments.length} {payments.length === 1 ? 'transaction' : 'transactions'}
                                </p>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="text-sm font-medium">Export CSV</span>
                                </button>
                            </div> */}

                            {/* Table */}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                                                User
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-48">
                                                Event
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-36">
                                                Order ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-36">
                                                Transaction ID
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-36">
                                                Date & Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-semibold text-gray-900 truncate max-w-[140px]" title={item.user_name}>
                                                        {item.user_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">ID: {item.user_id}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div
                                                        className={`text-sm font-medium text-gray-900 truncate max-w-[180px] ${item.event_name && item.event_name.length > 25
                                                            ? 'cursor-pointer hover:text-blue-600'
                                                            : ''
                                                            }`}
                                                        onClick={() => {
                                                            if (item.event_name && item.event_name.length > 25) {
                                                                setExpandedEventRow(expandedEventRow === idx ? null : idx);
                                                            }
                                                        }}
                                                        title={item.event_name || 'No Event Name'}
                                                    >
                                                        {expandedEventRow === idx
                                                            ? item.event_name || 'No Event Name'
                                                            : item.event_name || 'No Event Name'}
                                                    </div>
                                                    {/* <div className="text-xs text-gray-500">
                                                            Event ID: {item.event_id ?? '-'}
                                                        </div> */}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded block truncate max-w-[130px]" title={item.order_id || '-'}>
                                                        {item.order_id || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded block truncate max-w-[130px]" title={item.transaction_id || '-'}>
                                                        {item.transaction_id || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                        ₹{Number(item.amount).toLocaleString('en-IN')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${item.payment_status === 'SUCCESS'
                                                            ? 'bg-green-100 text-green-800'
                                                            : item.payment_status === 'PENDING'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : item.payment_status === 'REFUNDED'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {item.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs text-gray-1000 whitespace-nowrap">
                                                        {new Date(item.created_date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: '2-digit'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                                        {new Date(item.created_date).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                            hour12: false,
                                                        })}
                                                    </div>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-bold text-gray-900">
                                            {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-bold text-gray-900">
                                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                                        </span>{' '}
                                        of <span className="font-bold text-gray-900">{pagination.total}</span> results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-700 font-medium">Rows:</label>
                                        <select
                                            value={pagination.limit}
                                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pagination.page === pageNum
                                                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3) {
                                            return <span key={pageNum} className="text-gray-400 px-2">...</span>;
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === totalPages}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
</AdminLayout>
        </div>
    {/* Mobile */}
        <div className='block sm:hidden'>
        <AdminLayout>
  <div className="px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
    <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
      <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
        Home
      </a>{" "}
      / <span className="text-gray-700">Payments</span>
    </nav>
  </div>

  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <div className="max-w-7xl mx-auto"></div>

    {/* Filters Section */}
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
      <button
        onClick={() => setFiltersExpanded(!filtersExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {filtersExpanded && (
        <div className="p-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search by User</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter user name..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {userFilter && (
                  <button
                    onClick={() => setUserFilter("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Event Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all"
              >
                <option value="">All Events</option>
                {eventOptions.map((ev) => (
                  <option key={ev.id} value={ev.id.toString()}>
                    {ev.event_title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
        <X className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )}

    {/* Loading */}
    {loading && (
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading payment records...</p>
        </div>
      </div>
    )}

    {/* Table UI - Desktop & Tablet */}
    {!loading && payments.length > 0 && (
      <div className="hidden sm:block bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Order ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.user_name}</td>
                  <td>{item.event_name}</td>
                  <td>{item.order_id}</td>
                  <td>{item.transaction_id}</td>
                  <td>₹{Number(item.amount).toLocaleString("en-IN")}</td>
                  <td>{item.payment_status}</td>
                  <td>{new Date(item.created_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-gray-900">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-bold text-gray-900">{pagination.total}</span> results
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Rows:</label>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        pagination.page === pageNum
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "border border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3) {
                  return <span key={pageNum} className="text-gray-400 px-2">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Card UI - Mobile Only */}
    {!loading && payments.length > 0 && (
      <div className="block sm:hidden space-y-4">
        {payments.map((item, idx) => (
          <div key={idx} className="bg-white shadow-lg rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.user_name}</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  item.payment_status === "SUCCESS"
                    ? "bg-green-100 text-green-800"
                    : item.payment_status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : item.payment_status === "REFUNDED"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.payment_status}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-1 truncate">
              <span className="font-medium">Event:</span> {item.event_name || "-"}
            </p>
            <p className="text-xs text-gray-500 mb-1 truncate">
              <span className="font-medium">Order ID:</span> {item.order_id || "-"}
            </p>
            <p className="text-xs text-gray-500 mb-1 truncate">
              <span className="font-medium">Transaction ID:</span> {item.transaction_id || "-"}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              <span className="font-medium">Amount:</span> ₹{Number(item.amount).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium">Date & Time:</span>{" "}
              {new Date(item.created_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              })}{" "}
              {new Date(item.created_date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        ))}

        {/* Mobile Pagination */}
        {/* <div className="bg-white rounded-xl shadow-lg p-4 mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    pagination.page === pageNum
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "border border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3) {
              return <span key={pageNum} className="text-gray-400 px-2">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
          >
            Next
          </button>
        </div> */}
      </div>
    )}
    {/* Mobile Pagination with Info & Rows */}
<div className="bg-white rounded-xl shadow-lg p-4 mt-4 space-y-2">
  {/* Showing X to Y of Z */}
  <div className="text-sm text-gray-700 text-center">
    Showing{" "}
    <span className="font-bold">
      {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
    </span>{" "}
    to{" "}
    <span className="font-bold">
      {Math.min(pagination.page * pagination.limit, pagination.total)}
    </span>{" "}
    of <span className="font-bold">{pagination.total}</span> results
  </div>

  {/* Rows per page */}
  <div className="flex justify-center items-center gap-2">
    <label className="text-sm text-gray-700 font-medium">Rows:</label>
    <select
      value={pagination.limit}
      onChange={(e) => handleLimitChange(Number(e.target.value))}
      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  </div>

  {/* Pagination Buttons */}
  <div className="flex flex-wrap justify-center gap-2 mt-2">
    <button
      onClick={() => handlePageChange(pagination.page - 1)}
      disabled={pagination.page === 1}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
    >
      Previous
    </button>

    {[...Array(totalPages)].map((_, i) => {
      const pageNum = i + 1;
      if (
        pageNum === 1 ||
        pageNum === totalPages ||
        (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
      ) {
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              pagination.page === pageNum
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "border border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        );
      }
      if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3) {
        return <span key={pageNum} className="text-gray-400 px-2">...</span>;
      }
      return null;
    })}

    <button
      onClick={() => handlePageChange(pagination.page + 1)}
      disabled={pagination.page === totalPages}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
    >
      Next
    </button>
  </div>
</div>

  </div>
        </AdminLayout>

       </div>
</>
    );
};

export default PaymentHistoryPage;