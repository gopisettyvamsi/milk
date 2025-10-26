'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/layouts/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Save,
  X,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Calendar,
  CalendarClock
} from 'lucide-react';

interface JobPosting {
  id: string;
  job_title: string;
  job_description: string;
  job_location: string;
  job_type: string;
  salary_range: string;
  department: string;
  posted_date: string;
  experience_level: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  application_deadline?: string;
  application_start?: string;
  contact_email?: string;
  post_startdate: string;
  post_enddate: string;
}

const JobsAdminPanel = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<JobPosting>>({
    job_title: '',
    job_description: '',
    job_location: '',
    job_type: 'Full-time',
    salary_range: '',
    department: '',
    experience_level: 'Mid Level',
    requirements: [],
    responsibilities: [],
    benefits: [],
    application_deadline: '',
    application_start: '',
    contact_email: ''
  });

  const departments = ['Engineering', 'Marketing', 'Sales', 'Design', 'Data & Analytics', 'Customer Success'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  // Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs
  useEffect(() => {
    let filtered = jobs;
    console.log('Filtered Jobs:', filtered);
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(job => job.department === selectedDepartment);
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedDepartment]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Simulate API call
    //   const mockJobs: JobPosting[] = [
    //     {
    //       id: '1',
    //       job_title: 'Senior Frontend Developer',
    //       job_description: 'We are looking for an experienced Frontend Developer to join our dynamic team.',
    //       job_location: 'San Francisco, CA',
    //       job_type: 'Full-time',
    //       salary_range: '$120,000 - $160,000',
    //       department: 'Engineering',
    //       posted_date: '2024-06-01',
    //       experience_level: 'Senior Level'
    //     },
    //     {
    //       id: '2',
    //       job_title: 'Product Marketing Manager',
    //       job_description: 'Join our marketing team as a Product Marketing Manager.',
    //       job_location: 'New York, NY',
    //       job_type: 'Full-time',
    //       salary_range: '$90,000 - $130,000',
    //       department: 'Marketing',
    //       posted_date: '2024-05-28',
    //       experience_level: 'Mid Level'
    //     }
    //   ];
      const response = await fetch('/api/JobPostings');
      const jobs = await response.json();
      setJobs(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const method = editingJob ? 'PUT' : 'POST';
    try {
        await fetch('/api/JobPostings', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        await fetchJobs(); // Refresh jobs
        closeModal(); // Close the modal after successful submission
    } catch (error) {
        console.error('Error saving job:', error);
    }
};
  

  const handleDelete = async (jobId: number) => {
    await fetch('/api/JobPostings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId })
    });
  
    fetchJobs(); // Refresh jobs
  };
  
  const openModal = (job?: JobPosting) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        job_title: '',
        job_description: '',
        job_location: '',
        job_type: 'Full-time',
        salary_range: '',
        department: '',
        experience_level: 'Mid Level',
        requirements: [],
        responsibilities: [],
        benefits: [],
        application_deadline: '',
        application_start: '',
        contact_email: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleArrayInput = (field: 'requirements' | 'responsibilities' | 'benefits', value: string) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Jobs</h2>
        <nav className="text-sm text-gray-500">
          <a href="/admin/dashboard" className="hover:underline">Home</a> / <span>Jobs</span>
        </nav>
      </div>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs Administration</h1>
          <p className="text-gray-600">Manage job postings and career opportunities</p>
        </div> */}

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Job Button */}
            <button
              onClick={() => openModal()}
              className="bg-[#019c9d] text-white px-4 py-2 rounded-lg hover:bg-[#019c9d]/90 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Job
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#019c9d] mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search or create a new job posting.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.job_title}</h3>
                      <span className="bg-[#019c9d] text-white text-xs px-2 py-1 rounded-full">
                        {job.department}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{job.job_description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.job_location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.job_type}
                      </div>
                      {/* <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary_range}
                      </div> */}
                      {/* <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.experience_level}
                      </div> */}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {job.post_startdate}
                      </div>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-1" />
                        {job.post_enddate}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => openModal(job)}
                      className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Edit Job"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(Number(job.id))}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.job_title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      required
                      value={formData.department || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      required
                      value={formData.job_type || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.job_location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      required
                      value={formData.experience_level || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  {/* <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., $80,000 - $120,000"
                      value={formData.salary_range || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div> */}

                  {/* Application Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Start
                    </label>
                    <input
                      type="date"
                      value={formData.post_startdate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, post_startdate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>
                  {/* Application Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.post_enddate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, post_enddate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>

                  {/* Job Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.job_description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>

                  {/* Requirements */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements (one per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter each requirement on a new line"
                      value={formData.requirements?.join('\n') || ''}
                      onChange={(e) => handleArrayInput('requirements', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019c9d] focus:border-transparent"
                    />
                  </div>

                  
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-[#019c9d] text-white rounded-lg hover:bg-[#019c9d]/90 transition-colors flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default JobsAdminPanel;

function setOpen(arg0: boolean) {
    throw new Error('Function not implemented.');
}
