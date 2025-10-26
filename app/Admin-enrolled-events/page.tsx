'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Search, X, Users, Filter, Download, RefreshCw, ChevronDown } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useSession } from 'next-auth/react';
import AnimatedNumber from '@/components/AnimatedNumber';
import { useRouter } from 'next/navigation';


interface EnrolledEvent {
    event_id: number;
    user_name: string;
    event_slug: string;   // ✅ Add this
    user_id: number;
    event_name: string;
    event_date: string;
    payment_status: string;
    transaction_date?: string;
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

const EnrolledEventsPage = () => {
    const [events, setEvents] = useState<EnrolledEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [userFilter, setUserFilter] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
    const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10, total: 0 });
    const [error, setError] = useState<string | null>(null);
    const [filtersExpanded, setFiltersExpanded] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { data: session, status } = useSession();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


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
            const res = await fetch('/api/admin/enrolled-events?list=events');
            const data = await res.json();
            if (data.success) setEventOptions(data.data);
        } catch (err) {
            console.error('Error fetching event list:', err);
            setError('Failed to load events list');
        }
    };

    const fetchData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const params = new URLSearchParams({
                user: userFilter,
                event: selectedEvent,
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            const res = await fetch(`/api/admin/enrolled-events?${params}`);
            const data = await res.json();

            if (data.success) {
                setEvents(data.data);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination?.total || 0,
                }));
            } else {
                setError('Failed to load enrolled events');
            }
        } catch (err) {
            console.error('Error fetching enrolled events:', err);
            setError('An error occurred while loading data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userFilter, selectedEvent, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchAllEvents();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(delay);
    }, [userFilter, selectedEvent, pagination.page, fetchData]);

    const handleRefresh = () => fetchData(true);

    const clearFilters = () => {
        setUserFilter('');
        setSelectedEvent('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const exportToCSV = () => {
        const headers = ['User Name', 'Event Name', 'Event ID', 'Event Date', 'Transaction Date'];
        const rows = events.map(item => [
            item.user_name,
            item.event_name,
            item.event_id,
            new Date(item.event_date).toLocaleDateString('en-IN'),
            item.transaction_date
                ? new Date(item.transaction_date).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })
                : '-',
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enrolled-events-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const activeFiltersCount = [userFilter, selectedEvent].filter(Boolean).length;


    useEffect(() => {
        if (authorized) {
            fetchData();
        }
    }, [authorized, fetchData]);
    if (authorized === false) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p className="text-center text-red-600 p-10 text-lg font-semibold">
                    Unauthorized access. You do not have permission to view this page.
                </p>
            </div>
        );
    }

    return (
        <AdminLayout>

            <div className=" px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Enrolled Events</h2>
                <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
                    <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
                        Home
                    </a>{" "}
                    / <span className="text-gray-700">Enrolled Events</span>
                </nav>
            </div>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                </div>
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
                            <ChevronDown
                                className={`w-5 h-5 text-gray-500 transition-transform ${filtersExpanded ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </button>

                    {filtersExpanded && (
                        <div className="p-6 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                onClick={() => setUserFilter('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

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
                                                {ev.event_title} (ID: {ev.id})
                                            </option>

                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Table */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                        Loading enrolled events...
                    </div>
                ) : events.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No enrolled events found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Event
                                            </th>
                                            {/* <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                    Event ID
                                                </th> */}
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Event Date
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {events.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                                <td
                                                    className="px-4 py-3 text-sm font-semibold text-blue-700 hover:underline cursor-pointer"
                                                    onClick={() => router.push(`/admin/userdetails/${item.user_id}`)}
                                                    title="View user details"
                                                >
                                                    {item.user_name}
                                                </td>
                                                <td
                                                    className="px-4 py-3 text-sm text-gray-800 hover:text-blue-600 hover:underline cursor-pointer"
                                                    onClick={() => window.open(`/event/${item.event_slug}`, "_blank")}
                                                    title="View event details"
                                                >
                                                    {item.event_name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                                    <Calendar className="inline w-4 h-4 text-blue-500 mr-1" />
                                                    {new Date(item.event_date).toLocaleDateString("en-IN", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
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
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
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
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3)
                                            return <span key={pageNum} className="text-gray-400 px-2">...</span>;
                                        return null;
                                    })}
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === totalPages}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* </div> */}
        </AdminLayout>
    );
};

export default EnrolledEventsPage;
