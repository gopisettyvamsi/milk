"use client";
import React, { useState } from 'react';
import { Check, ChevronDown} from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    help: '',
    message: '',
    helpOption: ''
  });

  // State for form handling
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset status when user edits the form after a submission
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setStatusMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage('Thank you for contacting us! We\'ve sent you a confirmation email and will get back to you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          name: '',
          company: '',
          email: '',
          phone: '',
          help: '',
          message: '',
          helpOption: '',
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setStatusMessage(errorData.message || 'Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setStatusMessage('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (

    <section>
        {/* Contact Section */}
      <div className=" container mx-auto bg-gray-900 text-white py-8 px-2">
        <div className="container mx-auto">
          <div className="uppercase text-sm mb-4 tracking-wide ml-10">Contact Us</div>
          <h1 className="text-xl md:text-3xl font-bold mb-4 ml-10">
            Connect with our expert to discuss your goals and uncover the right tech solutions
          </h1>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-grow">
        <div className="container mx-auto px-0 pt-0 pb-8">
          <div className="flex flex-col lg:flex-row gap-8  p-6 rounded-md">
            {/* Left Content Section */}
            <div className="w-full lg:w-1/2  p-6 rounded-md">
              <p className="text-gray-700 mb-6">
                We&apos;re happy to answer any questions you may have and help you determine which of our services best fit your needs.
              </p>
              
              <p className="text-gray-800 font-semibold mb-6">
                For Enquiries, reach out at : sales@kagof
              </p>
              
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Your benefits:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <div className="bg-teal-500 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>Client-oriented</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-500 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>Results-driven</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-500 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>Independent</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-500 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>Problem-solving</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-500 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>Competent</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-500 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>Transparent</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">What happens next?</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-start">
                    <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2 flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm">We schedule a call at your convenience</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2 flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm">We do a discovery and consulting meeting</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2 flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm">We prepare a proposal</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="w-full lg:w-1/2 bg-teal-100 ">
              <div className="bg-white p-6 rounded-md">
                
                { /*<div className="text-center mb-6">
                  <h2 className="text-lg font-semibold">Schedule a Meeting</h2>
                  <div className="flex justify-center my-2">
                    <div className="bg-teal-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div> */ }
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Company / Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>

                                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">Company Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2"
                      required
                    />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    </div>
                  </div>
                  
                 
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-1">How Can We Help You?</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={toggleDropdown}
                        className="w-full text-left border border-gray-300 rounded p-2 flex justify-between items-center"
                      >
                        {formData.helpOption || "Select Option"}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
                          <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, helpOption: "IT Consulting" }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            IT Consulting
                          </div>
                          <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, helpOption: "Software Development" }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            Software Development
                          </div>
                          <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, helpOption: "Digital Transformation" }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            <strong>Cribl</strong> Advisory
                          </div>
                          <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, helpOption: "Digital Transformation" }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            Digital Transformation
                          </div>
                          <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, helpOption: "Digital Transformation" }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            Security Enginnering
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2 h-32"
                      placeholder="To better assist you, please describe how we can help..."
                    ></textarea>
                  </div>
                  
                  {submitStatus === 'success' && (
                    <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
                      <p>{statusMessage}</p>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                      <p>{statusMessage}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center w-full sm:w-auto bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;