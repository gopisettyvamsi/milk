"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Code as _Code } from "lucide-react"

import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Image as ImageIcon,
  Search,
  X,
  Filter,
  ChevronDown,
  RefreshCw as _RefreshCw,
} from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"

interface Event {
  id: string
  event_title: string
  event_description: string
  event_image: string
  event_location: string
  event_date: string
  event_start_date: string
  event_end_date: string
  event_start_time: string
  event_end_time: string
  event_category: string
  created_at: string
}

interface PaginationParams {
  page: number
  limit: number
  total: number
}

export default function AdminEventPanelClient() {
  const [events, setEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchFilter, setSearchFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [filtersExpanded, setFiltersExpanded] = useState(true)
  const [_refreshing, setRefreshing] = useState(false)
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 5, total: 0 })

  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const stripHtml = (html: string): string => {
    const withoutTags = html.replace(/<[^>]+>/g, "")
    const textarea = document.createElement("textarea")
    textarea.innerHTML = withoutTags
    return textarea.value
  }

  const fetchEvents = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true)
        else setIsLoading(true)

        const response = await fetch("/api/events")
        const data = await response.json()

        if (Array.isArray(data)) {
          let filteredData = data

          if (searchFilter) {
            filteredData = filteredData.filter((event) =>
              event.event_title.toLowerCase().includes(searchFilter.toLowerCase()) ||
              stripHtml(event.event_description).toLowerCase().includes(searchFilter.toLowerCase())
            )
          }

          if (categoryFilter) {
            filteredData = filteredData.filter((event) => event.event_category === categoryFilter)
          }

          setAllEvents(filteredData)
          const startIndex = (pagination.page - 1) * pagination.limit
          const endIndex = startIndex + pagination.limit
          setEvents(filteredData.slice(startIndex, endIndex))
          setPagination((prev) => ({ ...prev, total: filteredData.length }))
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
        setRefreshing(false)
      }
    },
    [pagination.page, pagination.limit, searchFilter, categoryFilter]
  )

  useEffect(() => {
    const delay = setTimeout(() => fetchEvents(), 300)
    return () => clearTimeout(delay)
  }, [searchFilter, categoryFilter, pagination.page, fetchEvents])

  useEffect(() => {
    if (searchParams.get("updated") === "true") {
      setShowSuccess(true)

      const timer = setTimeout(() => {
        setShowSuccess(false)
        const url = new URL(window.location.href)
        url.searchParams.delete("updated")
        router.replace(url.pathname)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  const _handleRefresh = () => fetchEvents(true)

  const clearFilters = () => {
    setSearchFilter("")
    setCategoryFilter("")
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/events/${id}`, { method: "DELETE" })

        if (response.ok) {
          await fetchEvents()
          alert("Event deleted successfully")
        } else {
          console.error("Failed to delete event")
        }
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const formatTime = (timeString: string) =>
    new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const activeFiltersCount = [searchFilter, categoryFilter].filter(Boolean).length
  const categories = [...new Set(allEvents.map((event) => event.event_category))]

  return (
    <AdminLayout>
      <div className=" px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
        <nav className="text-sm text-gray-500 mt-2 sm:mt-0">
          <a href="/admin/dashboard" className="hover:underline hover:text-blue-600 transition-colors">
            Home
          </a>{" "}
          / <span className="text-gray-700">All Events</span>
        </nav>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="w-full flex justify-end items-center gap-3 mb-6">
            <button
              onClick={() => (window.location.href = "/Admin-event-panel/add-event")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Event</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{activeFiltersCount}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      clearFilters()
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Search Events</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10 pr-4 h-11 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      {searchFilter && (
                        <button onClick={() => setSearchFilter("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 transition-all">
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Events List */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No events found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new event</p>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet View */}
              <div className="hidden sm:block bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {events.map((event, index) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-center justify-between p-6 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                          {event.event_image ? (
                            <img src={event.event_image} alt={event.event_title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{event.event_title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{stripHtml(event.event_description)}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{event.event_category}</span>

                            {event.event_start_date && (
                              <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Calendar size={14} className="text-blue-500" />
                                <span className="font-medium">
                                  {formatDate(event.event_start_date)}
                                  {event.event_end_date && <> – {formatDate(event.event_end_date)}</>}
                                </span>
                              </span>
                            )}

                            {(event.event_start_time || event.event_end_time) && (
                              <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock size={14} className="text-green-500" />
                                <span className="font-medium">
                                  {event.event_start_time && formatTime(event.event_start_time)}
                                  {event.event_end_time && event.event_start_time && <> – </>}
                                  {event.event_end_time && formatTime(event.event_end_time)}
                                </span>
                              </span>
                            )}

                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <MapPin size={14} className="text-red-500" />
                              <span className="font-medium truncate max-w-[150px]">{event.event_location}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button onClick={() => (window.location.href = `/Admin-event-panel/add-event?id=${event.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md">Edit</button>
                        <button onClick={() => handleDelete(event.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-sm hover:shadow-md">Delete</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile View */}
              <div className="sm:hidden flex flex-col gap-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2">
                    <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                      {event.event_image ? (
                        <img src={event.event_image} alt={event.event_title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{event.event_title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{stripHtml(event.event_description)}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{event.event_category}</span>
                      {event.event_start_date && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar size={12} className="text-blue-500" />
                          {formatDate(event.event_start_date)}
                          {event.event_end_date && <> – {formatDate(event.event_end_date)}</>}
                        </span>
                      )}
                      {(event.event_start_time || event.event_end_time) && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock size={12} className="text-green-500" />
                          {event.event_start_time && formatTime(event.event_start_time)}
                          {event.event_end_time && event.event_start_time && <> – </>}
                          {event.event_end_time && formatTime(event.event_end_time)}
                        </span>
                      )}
                      <span className="text-xs text-gray-600 flex items-center gap-1 truncate max-w-[120px]">
                        <MapPin size={12} className="text-red-500" />
                        {event.event_location}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => (window.location.href = `/Admin-event-panel/add-event?id=${event.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-bold text-gray-900">{pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}</span>{' '}
                to{' '}
                <span className="font-bold text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{' '}
                of <span className="font-bold text-gray-900">{pagination.total}</span> results
              </div>
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm">Previous</button>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)) {
                    return (
                      <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pagination.page === pageNum ? 'bg-blue-600 text-white shadow-md' : 'border border-gray-300 bg-white hover:bg-gray-50'}`}>
                        {pageNum}
                      </button>
                    )
                  }
                  if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3) return <span key={pageNum} className="text-gray-400 px-2">...</span>
                  return null
                })}
                <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-700 font-semibold">Event updated successfully!</span>
            <button onClick={() => setShowSuccess(false)} className="ml-3 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
