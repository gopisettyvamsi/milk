"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, User, Heart, Download, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import UserLayout from "@/components/layouts/UserLayout";
import PaymentButton from "@/components/PaymentButton";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Event {
  id: number;
  event_title: string;
  slug: string;
  event_description: string;
  event_image: string;
  event_location: string;
  event_category: string;
  event_start_date: string;
  event_end_date: string | null;
  event_start_time: string;
  event_end_time: string | null;
  created_at: string;
  event_price: number;
  earlybird_registration_date?: string | null;
  category_prices?: Array<{
    category_id: number;
    category_name: string;
    price: string | number | null;
    earlybird_registration_price?: string | null;
    spot_registration_price?: string | null;
  }>;
}

interface Magazine {
  id: number;
  event_id: number;
  title: string;
  author: string;
  file_url: string;
  brochure_url: string;
  publish_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
 
interface Question {
  id: string;
  event_id: number;
  question: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  options: string[];
  is_required: boolean;
  sort_order: number;
}
 
const EventDetailPage = () => {
  const { data: session, status } = useSession();
  void status; // used to silence unused var lint warning
  const user_role = session?.user?.role;
  const user_id = session?.user?.id ? Number(session.user.id) : undefined;

  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [magazineLoading, setMagazineLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  // States for step-by-step questions
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'TBA';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }; 
  // Fetch questions for the event
  const fetchQuestions = async (eventId: number) => {
    try {
      setQuestionsLoading(true);
      const response = await fetch(`/api/admin/questions?event_id=${eventId}`);
 
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setQuestions(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };
 
  // Fetch existing answers when questions modal opens
  const fetchExistingAnswers = async (eventId: number) => {
    if (!user_id) return;
 
    try {
      const response = await fetch(`/api/admin/answers?user_id=${user_id}&event_id=${eventId}`);
     
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const existingAnswers: Record<string, string | string[]> = {};
         
          result.data.forEach((item: any) => {
            if (item.answer && item.answer.includes(', ')) {
              existingAnswers[item.question_id] = item.answer.split(', ');
            } else {
              existingAnswers[item.question_id] = item.answer;
            }
          });
         
          setAnswers(existingAnswers);
          console.log('Loaded existing answers:', existingAnswers);
        }
      }
    } catch (error) {
      console.error('Error fetching existing answers:', error);
    }
  };
 
  const saveAnswerToDB = async (questionId: string, answer: string | string[]): Promise<boolean> => {
    if (!event || !user_id) return false;
 
    try {
      setSavingAnswer(true);
 
      // Process the answer to ensure it's stored properly
      let processedAnswer = answer;
 
      if (Array.isArray(answer)) {
        processedAnswer = answer.filter(item => item && item !== '').join(', ');
        if (processedAnswer === '') return true;
      } else {
        processedAnswer = answer.toString().trim();
        if (processedAnswer === '') return true;
      }
 
      // Save individual answer to database
      const response = await fetch('/api/admin/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          event_id: event.id,
          question_id: questionId,
          answer: processedAnswer
        }),
      });
 
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error('Server returned an error page instead of JSON response');
      }
 
      const result = await response.json();
 
      if (!response.ok) {
        throw new Error(result.error || result.message || `HTTP error! status: ${response.status}`);
      }
 
      if (result.success) {
        console.log('✅ Answer saved successfully:', { questionId, answer: processedAnswer });
        return true;
      } else {
        throw new Error(result.error || 'Failed to save answer');
      }
    } catch (error: any) {
      console.error('❌ Error saving answer:', error);
      alert(`Failed to save answer: ${error.message}. Please try again.`);
      return false;
    } finally {
      setSavingAnswer(false);
    }
  };
 
  // Handle answer change
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
 
  // Handle checkbox change
  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const currentAnswers = answers[questionId] as string[] || [];
 
    if (checked) {
      const newAnswers = [...currentAnswers, option];
      handleAnswerChange(questionId, newAnswers);
    } else {
      const newAnswers = currentAnswers.filter(item => item !== option);
      handleAnswerChange(questionId, newAnswers);
    }
  };
 
  // Go to next question and save current answer
  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
 
    // Validate current question if required
    if (currentQuestion.is_required) {
      const answer = answers[currentQuestion.id];
      if (!answer ||
        (Array.isArray(answer) && answer.length === 0) ||
        answer === '' ||
        answer.toString().toLowerCase().includes('none of these')) {
        alert(`Please answer this required question: ${currentQuestion.question}`);
        return;
      }
    }
 
    // Save current answer to database and wait for completion
    if (answers[currentQuestion.id]) {
      const saveSuccess = await saveAnswerToDB(currentQuestion.id, answers[currentQuestion.id]);
      if (!saveSuccess) {
        alert('Failed to save your answer. Please try again.');
        return;
      }
    }
 
    // Move to next question only after saving
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
 
  // Go to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
 
  // Clear all question states
  const clearQuestionStates = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitting(false);
    setSavingAnswer(false);
  };
 
  // Final submission - save last answer, clear states, and proceed to payment
  const handleFinalSubmit = async () => {
    if (!event || !user_id) return;
 
    const currentQuestion = questions[currentQuestionIndex];
 
    // Validate last question if required
    if (currentQuestion.is_required) {
      const answer = answers[currentQuestion.id];
      if (!answer ||
        (Array.isArray(answer) && answer.length === 0) ||
        answer === '' ||
        answer.toString().toLowerCase().includes('none of these')) {
        alert(`Please answer this required question: ${currentQuestion.question}`);
        return;
      }
    }
 
    try {
      setSubmitting(true);
 
      // Save the last answer to database and wait for completion
      let saveSuccess = true;
      if (answers[currentQuestion.id]) {
        saveSuccess = await saveAnswerToDB(currentQuestion.id, answers[currentQuestion.id]);
      }
 
      if (!saveSuccess) {
        alert('Failed to save your answers. Please try again.');
        setSubmitting(false);
        return;
      }
 
      console.log('✅ All answers saved, clearing states and proceeding to payment...');
 
      // Clear all question states before proceeding to payment
      clearQuestionStates();
 
      // Close questions modal and show payment button
      setShowQuestions(false);
      setShowPaymentButton(true);
      setTimeout(() => {
      const paymentBtn = document.getElementById("autoPaymentTrigger");
      if (paymentBtn) (paymentBtn as HTMLButtonElement).click();
    }, 500);

    } catch (error: any) {
      console.error('❌ Error in submission process:', error);
    alert(error.message || 'Failed to process registration');
    setSubmitting(false);
  }
};
  // Handle successful payment
  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
    setShowPaymentButton(false);
    alert('Payment successful! You are now enrolled in the event.');
    router.push('/user/enrolled-events');
  };
 
  // Handle payment cancellation or failure
  const handlePaymentCancel = () => {
    setShowPaymentButton(false);
    // User can restart the process by clicking "Click here to pay" again
  };

  // Fetch magazine data
  const fetchMagazine = async (eventId: number) => {
    try {
      setMagazineLoading(true);
      const response = await fetch(`/api/admin/magazine?eventId=${eventId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setMagazine(result.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching magazine:', err);
    } finally {
      setMagazineLoading(false);
    }
  };

  const handlePaymentClick = async () => {
    if (!event) return;
  // Reset state first
  clearQuestionStates();
  setShowQuestions(false);
  setShowPaymentButton(false);

  try {
    // Fetch questions dynamically
    const response = await fetch(`/api/admin/questions?event_id=${event.id}`);
    if (!response.ok) throw new Error("Failed to fetch questions");

    const result = await response.json();
    const fetchedQuestions = result?.data || [];

    // ✅ If there are NO questions → go straight to payment
    if (fetchedQuestions.length === 0) {
      setShowPaymentButton(true);

      // Automatically trigger payment
      setTimeout(() => {
        const paymentBtn = document.getElementById("autoPaymentTrigger");
        if (paymentBtn) (paymentBtn as HTMLButtonElement).click();
      }, 300);
      return;
    }

    // ✅ If there ARE questions → show modal
    setQuestions(fetchedQuestions);
    await fetchExistingAnswers(event.id);
    setShowQuestions(true);
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Fallback — show payment if any API issue occurs
    setShowPaymentButton(true);

    // Auto-trigger payment
    setTimeout(() => {
      const paymentBtn = document.getElementById("autoPaymentTrigger");
      if (paymentBtn) (paymentBtn as HTMLButtonElement).click();
    }, 300);
  }
};

 
  // Handle modal close - clear states
  const handleModalClose = () => {
    clearQuestionStates();
    setShowQuestions(false);
  };
 
  // Simple direct download function
  const handleDownload = async (url: string, filename: string, type: 'brochure' | 'magazine') => {
    if (!url) {
      alert('Download link not available');
      return;
    }

    try {
      setDownloading(type);
      
      // Create a temporary anchor element for direct download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank'; // Open in new tab as fallback
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: Open in new tab
      window.open(url, '_blank');
      alert('Download started in new tab. Please use browser options to save the file.');
      
    } finally {
      setDownloading(null);
    }
  };

  // Enhanced download with fetch for better control
  const downloadWithFetch = async (url: string, filename: string, type: 'brochure' | 'magazine') => {
    if (!url) {
      alert('Download link not available');
      return;
    }

    try {
      setDownloading(type);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct download
      handleDownload(url, filename, type);
    } finally {
      setDownloading(null);
    }
  };
 
  // Check if a question has been answered
  const isQuestionAnswered = (questionId: string) => {
    const answer = answers[questionId];
    return answer &&
           answer !== '' &&
           !(Array.isArray(answer) && answer.length === 0) &&
           !answer.toString().toLowerCase().includes('none of these');
  };
 
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const responseData = await fetch(`/api/events/user/event/${slug}`);

        if (!responseData.ok) {
          if (responseData.status === 404) {
            throw new Error('Event not found');
          }
          throw new Error('Failed to fetch event');
        }
        const eventData = await responseData.json();

        setIsEnrolled(eventData.isEnrolled);
        setEvent(eventData);

        if (eventData.id) {
          fetchMagazine(eventData.id);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  useEffect(() => {
    if (session?.user) {
      const fetchDetails = async () => {
        try {
          const res = await fetch(`/api/userdetails?user_id=${session.user.id}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to fetch user details');
          setUserDetails(data);
        } catch (err) {
          console.error('Error fetching user details:', err);
        }
      };

      fetchDetails();
    }
  }, [session]);

  // Compute the price for the current user based on their category and earlybird rules
  const computePriceForUser = (): number => {
    // Default to event.event_price
    const basePrice = event?.event_price ?? 0;

  if (!event) return basePrice;

    const now = Date.now();

    // Try to find category match from userDetails.category against event.category_prices
    const userCategory = userDetails?.category;
  if (userCategory && Array.isArray(event.category_prices)) {
      // case-insensitive match
      const matched = event.category_prices.find((cp) => cp.category_name?.toString().toLowerCase() === userCategory.toString().toLowerCase());
      if (matched) {
        // If earlybird date exists and now is before it, prefer earlybird price when available
        const earlybirdDate = event.earlybird_registration_date ? new Date(event.earlybird_registration_date).getTime() : null;

        // added for spot registration condition
        const startDate = event.event_start_date ? new Date(event.event_start_date).getTime() : null;
        if (startDate && now >= startDate && matched.spot_registration_price) {
          const p = Number(matched.spot_registration_price);
          if (!isNaN(p)) return p;
        }

        if (earlybirdDate && now < earlybirdDate && matched.earlybird_registration_price) {
          const p = Number(matched.earlybird_registration_price);
          if (!isNaN(p)) return p;
        }

        // Fallback to category price
        if (matched.price) {
          const p = Number(matched.price);
          if (!isNaN(p)) return p;
        }
      }
    }

    // If no user-specific price found, consider global earlybird if present
    if (event.earlybird_registration_date) {
      const eb = new Date(event.earlybird_registration_date).getTime();
      if (!isNaN(eb) && now < eb) {
        // no specific earlybird price available globally in payload; keep basePrice
      }
    }

    return basePrice;
  };

  const computedPrice = computePriceForUser();

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/user/enrolled-events')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!event) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/user/enrolled-events')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Generate materials based on magazine data
  interface Material {
      name: string;
      url: string;
      filename: string;
      type: 'brochure' | 'magazine';
      description?: string;
    }

  const generateMaterials = (): Material[] => {
    const materials: Material[] = [];

    if (magazine?.brochure_url) {
      materials.push({
        name: "Download Brochure",
        url: magazine.brochure_url,
        filename: `brochure-${event.event_title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        type: 'brochure'
      });
    } else {
      materials.push({
        name: "Download Brochure",
        url: "",
        filename: "",
        type: 'brochure'
      });
    }

    if (magazine?.file_url) {
      materials.push({
        name: "Download Magazine",
        url: magazine.file_url,
        filename: `magazine-${event.event_title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        type: 'magazine'
      });
    } else {
      materials.push({
        name: "Download Magazine",
        url: "",
        filename: "",
        type: 'magazine'
      });
    }

    return materials;
  };

  const materials = generateMaterials();
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
 
  return (
    <UserLayout>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4 pt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={event.event_image || "/default-event.jpg"}
                    alt={event.event_title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow">
                      {event.event_category}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">{event.event_title}</h1>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center text-sm font-semibold">
                      <Heart className="w-4 h-4 mr-1 fill-current" />
                      Available
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
                    <div
                      dangerouslySetInnerHTML={{ __html: event.event_description }}
                    />
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(event.event_start_date)}
                        </p>
                        {event.event_end_date && (
                          <p className="text-xs text-gray-500">
                            to {formatDate(event.event_end_date)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatTime(event.event_start_time)}
                          {event.event_end_time && ` - ${formatTime(event.event_end_time)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="text-sm font-semibold text-gray-800">{event.event_location}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                        <p className="text-sm font-semibold text-gray-800">{event.event_category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Download Section */}
                   <div>
                    {magazineLoading ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        {/* Check if we have any materials to display */}
                        {(() => {
                          const hasBrochure = materials.some(material => material.url && material.type === 'brochure');
                          const hasMagazine = magazine && magazine.file_url;
                          
                          console.log('Display check:', { hasBrochure, hasMagazine });
                          
                          // If nothing to display, show empty state
                          // if (!hasBrochure && !hasMagazine) {
                          //   return (
                          //     <div className="text-center py-8 bg-gray-50 rounded-lg">
                          //       <p className="text-gray-500">No event highlights available at the moment.</p>
                          //     </div>
                          //   );
                          // }
                          
                          return (
                            <div className="space-y-4">
                              {/* Brochure details section - only show if brochure exists */}
                              {hasBrochure && (
                                <div className="p-4 bg-gray-50 rounded-lg relative">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-800">Event Brochure</h3>
                                    {materials.find(material => material.type === 'brochure' && material.url) && (
                                      <button
                                        onClick={() => {
                                          const brochure = materials.find(material => material.type === 'brochure');
                                          brochure && brochure.url && downloadWithFetch(brochure.url, brochure.filename, 'brochure');
                                        }}
                                        disabled={downloading === 'brochure'}
                                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                      >
                                        {downloading === 'brochure' ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                          <Download className="w-4 h-4 mr-2" />
                                        )}
                                        <span className="text-sm">
                                          {downloading === 'brochure' ? 'Downloading...' : 'Download'}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                  {materials.find(material => material.type === 'brochure')?.description && (
                                    <p className="text-sm text-gray-600">
                                      <strong>Description:</strong> {materials.find(material => material.type === 'brochure')?.description}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* Magazine details section - only show if magazine exists */}
                              {hasMagazine && (
                                <div className="p-4 bg-gray-50 rounded-lg relative">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-800">Event Magazine</h3>
                                    {magazine.file_url && (
                                      <button
                                        onClick={() => downloadWithFetch(magazine.file_url, `${magazine.title}.pdf`, 'magazine')}
                                        disabled={downloading === 'magazine'}
                                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                      >
                                        {downloading === 'magazine' ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                          <Download className="w-4 h-4 mr-2" />
                                        )}
                                        <span className="text-sm">
                                          {downloading === 'magazine' ? 'Downloading...' : 'Download'}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Event Fee</h3>

                  {/* <div className="text-3xl font-bold text-green-600 mb-2">
                    ₹{computedPrice.toLocaleString()}
                  </div> */}
                  <div className="w-full">
                    <div className="flex justify-center">
                      {isEnrolled ? (
                        <div className="text-center text-lg text-green-600 font-semibold">
                          You have already enrolled for this event.
                        </div>
                      ) : user_role === "admin" ? (
                        <div className="text-center text-lg text-red-600 font-semibold">
                          Admin cannot register for events.<br /> Please use a personal account.
                        </div>
                      ) : user_id !== undefined ? (
                        showPaymentButton ? (
                          <PaymentButton
                           id="autoPaymentTrigger"
                            user_id={user_id}
                            event_id={event.id}
                            amount={computedPrice}
                            user_name={session?.user?.name || "Guest User"}
                            user_email={session?.user?.email || "guest@example.com"}
                            event_title={event.event_title}
                            onSuccess={handlePaymentSuccess}
                            onCancel={handlePaymentCancel}
                          />
                        ) : (
                          <button
                            onClick={handlePaymentClick}
                            className="flex items-center justify-between
                              w-56 px-4 py-3
                              border border-blue-600 text-blue-600
                              bg-white hover:bg-blue-50
                              rounded-lg shadow-sm font-medium
                              transition-colors duration-200"
                          >
                            <span className="flex-1 text-center">Click here to pay</span>
                          </button>
                        )
                      ) : (
                        <div className="flex items-center justify-center">
                          <Link
                            href="/login"
                            className="flex items-center justify-between
                              w-56 px-4 py-3
                              border border-blue-600 text-blue-600
                              bg-white hover:bg-blue-50
                              rounded-lg shadow-sm font-medium
                              transition-colors duration-200"
                          >
                            <span className="flex-1 text-center">Login to enroll</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
 
        {/* Questions Modal */}
        {showQuestions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Event Registration Questions
                  </h2>
                  <button
                    onClick={handleModalClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
 
                {questionsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No registration questions required for this event.
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          clearQuestionStates();
                          setShowQuestions(false);
                          setShowPaymentButton(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {questions.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentQuestionIndex
                                ? 'bg-blue-600'
                                : isQuestionAnswered(questions[index].id)
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                            }`}
                            title={index === currentQuestionIndex ? 'Current' : isQuestionAnswered(questions[index].id) ? 'Answered' : 'Unanswered'}
                          />
                        ))}
                      </div>
                    </div>
 
                    {/* Current Question */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentQuestion.question}
                        {currentQuestion.is_required && <span className="text-red-500 ml-1">*</span>}
                      </label>
 
                      {currentQuestion.type === 'text' && (
                        <input
                          type="text"
                          value={answers[currentQuestion.id] as string || ''}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your answer..."
                        />
                      )}
 
                      {currentQuestion.type === 'textarea' && (
                        <textarea
                          value={answers[currentQuestion.id] as string || ''}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your answer..."
                        />
                      )}
 
                      {currentQuestion.type === 'radio' && (
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={option}
                                checked={answers[currentQuestion.id] === option}
                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                className="mr-2 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
 
                      {currentQuestion.type === 'checkbox' && (
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                value={option}
                                checked={(answers[currentQuestion.id] as string[] || []).includes(option)}
                                onChange={(e) => handleCheckboxChange(currentQuestion.id, option, e.target.checked)}
                                className="mr-2 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
 
                    {/* Navigation Buttons */}
                    <div className="flex justify-between space-x-3 pt-4">
                      <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>
 
                      <div className="flex space-x-3">
                        <button
                          onClick={handleModalClose}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
 
                        {isLastQuestion ? (
                          <button
                            onClick={handleFinalSubmit}
                            disabled={submitting || savingAnswer}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {submitting ? 'Submitting...' : 'Submit & Proceed to Payment'}
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            disabled={savingAnswer}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {savingAnswer ? 'Saving...' : 'Next'}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default EventDetailPage;