"use client"
import React, { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, FileText, Image as ImageIcon } from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import TabsNav from "@/components/admin/TabsNav"

interface AddMagazineProps {
  eventId?: string | null
}

interface MagazineFormData {
  title: string
  author: string
  publish_date: string
  is_published: boolean
  event_id: string // ✅ add event_id in state
}

export default function AddOrEditMagazineClient({ eventId }: AddMagazineProps) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const magazineId = params?.id as string | undefined

  const eventIdFromQuery = typeof (searchParams as any)?.get === 'function' ? (searchParams as any).get("eventId") : undefined

  console.log("Magazine ID:", magazineId, "Event ID:", eventId || eventIdFromQuery)

  const [formData, setFormData] = useState<MagazineFormData>({
    title: "",
    author: "",
    publish_date: "",
    is_published: false,
    event_id: eventIdFromQuery || eventId || "",
  })

  const [events, setEvents] = useState<any[]>([])
  const [magazineFile, setMagazineFile] = useState<File | null>(null)
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null)
  const [_existingBrochureUrl, setExistingBrochureUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!eventId && !eventIdFromQuery) {
      fetch("/api/events")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setEvents(data)
        })
        .catch(() => toast.error("Failed to load events"))
    }
  }, [eventId, eventIdFromQuery])

  useEffect(() => {
    if (magazineId) {
      setIsEditing(true)
      fetch(`/api/admin/magazine?id=${magazineId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch magazine")
          return res.json()
        })
        .then((data) => {
          if (data?.success && data.data) {
            const magazine = data.data
            setFormData((prev) => ({
              ...prev,
              title: magazine.title || "",
              author: magazine.author || "",
              publish_date: magazine.publish_date || "",
              is_published: !!magazine.is_published,
              event_id: magazine.event_id?.toString() || prev.event_id,
            }))
            setExistingFileUrl(magazine.file_url || null)
            setExistingBrochureUrl(magazine.brochure_url || null)
          } else {
            throw new Error("Invalid data format")
          }
        })
        .catch((err) => {
          console.error("Error loading magazine:", err)
          toast.error("Failed to load magazine details.")
        })
    }
  }, [magazineId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileFunc: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFileFunc(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Title is required.")
      return
    }

    if (!formData.event_id) {
      toast.error("Please select or provide an Event.")
      return
    }

    if (!isEditing && !magazineFile) {
      toast.error("Please upload a magazine file (PDF).")
      return
    }

    setIsSubmitting(true)

    try {
      const formPayload = new FormData()
      formPayload.append("title", formData.title.trim())
      formPayload.append("author", formData.author.trim())
      formPayload.append("publish_date", formData.publish_date)
      formPayload.append("is_published", formData.is_published.toString())
      formPayload.append("event_id", formData.event_id)

      if (magazineFile) formPayload.append("magazine_file", magazineFile)
      if (brochureFile) formPayload.append("brochure_file", brochureFile)

      let endpoint = "/api/admin/magazine"
      let method = "POST"
      if (isEditing && magazineId) {
        endpoint = `/api/admin/magazine?id=${magazineId}`
        method = "PUT"
      }

      const res = await fetch(endpoint, { method, body: formPayload })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} magazine`)
      }

      toast.success(isEditing ? "Magazine updated successfully!" : "Magazine created successfully!")
      router.push("/Admin-event-panel/magazine")
      router.refresh()
    } catch (err: any) {
      console.error("Submission error:", err)
      toast.error(err.message || `Error ${isEditing ? "updating" : "creating"} magazine`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <TabsNav />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{isEditing ? "Edit Magazine" : "Add Magazine"}</h2>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {!eventId && !eventIdFromQuery && (
              <div>
                <label className="block font-medium mb-2 text-sm">Select Event *</label>
                <select
                  name="event_id"
                  value={formData.event_id}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  required
                >
                  <option value="">-- Choose Event --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.event_title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-medium mb-2 text-sm">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019c9d]"
                placeholder="Enter magazine title"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-sm">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019c9d]"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-sm flex items-center gap-2">
                <Calendar size={16} /> Publish Date
              </label>
              <input
                type="date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019c9d]"
              />
            </div>

            <div>
              <label className="font-medium mb-2 text-sm flex items-center gap-2">
                <FileText size={16} /> Magazine File (PDF) *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, setMagazineFile)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2"
                required={!isEditing}
              />
              {magazineFile && (
                <p className="text-sm text-green-600 mt-1">✅ Selected: {magazineFile.name}</p>
              )}
              {!magazineFile && existingFileUrl && (
                <div className="mt-2">
                  <a href={existingFileUrl} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1">
                    📄 View existing file
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="font-medium mb-2 text-sm flex items-center gap-2">
                <ImageIcon size={16} /> Brochure File (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileChange(e, setBrochureFile)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {brochureFile && (
                <p className="text-sm text-green-600 mt-1">✅ Selected: {brochureFile.name}</p>
              )}
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="w-4 h-4 text-[#019c9d] bg-gray-100 border-gray-300 rounded focus:ring-[#019c9d]"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                Publish Immediately
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" className="bg-[#019c9d] hover:bg-[#017879] text-white px-6 py-2" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? "Updating..." : "Uploading...") : isEditing ? "Update Magazine" : "Upload Magazine"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/Admin-magazine-panel")} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
