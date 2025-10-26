"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Calendar, UserCircle } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  user_id: string;
  prefix: string;
  other_prefix: string;
  firstname: string;
  lastname: string;
  specialization: string;
  designation: string;
  phonenumber: string;
  qualification: string;
  address: string;
  state: string;
  nationality: string;
  college_hospital: string;
  category: string;
  achievements: string;
  bio_details: string;
  created_at: string;
}

interface ProfileFormData {
  prefix: string;
  other_prefix: string;
  firstname: string;
  lastname: string;
  specialization: string;
  designation: string;
  phonenumber: string;
  qualification: string;
  address: string;
  state: string;
  nationality: string;
  college_hospital: string;
  category: string;
  achievements: string;
  bio_details: string;
}

interface Errors {
  [key: string]: string;
}

const UserProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "biodata">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    prefix: "",
    other_prefix: "",
    firstname: "",
    lastname: "",
    specialization: "",
    designation: "",
    phonenumber: "",
    qualification: "",
    address: "",
    state: "",
    nationality: "",
    college_hospital: "",
    category: "",
    achievements: "",
    bio_details: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserDetails();
    }
  }, [session]);

  // Prefill function for only firstname and lastname
  const prefillNameFromSession = () => {
    const sessionData = {
      prefix: "",
      other_prefix: "",
      firstname: session?.user?.name?.split(' ')[0] || "",
      lastname: session?.user?.name?.split(' ')[1] || "",
      specialization: "",
      designation: "",
      phonenumber: "",
      qualification: "",
      address: "",
      state: "",
      nationality: "",
      college_hospital: "",
      category: "",
      achievements: "",
      bio_details: "",
    };

    setFormData(sessionData);
    return sessionData;
  };

  const fetchUserDetails = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        // If no userId but we have session, still prefill names
        if (session?.user) {
          prefillNameFromSession();
        }
        return;
      }

      const response = await fetch(`/api/userdetails?user_id=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          prefix: data.prefix || "",
          other_prefix: data.other_prefix || "",
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          specialization: data.specialization || "",
          designation: data.designation || "",
          phonenumber: data.phonenumber || "",
          qualification: data.qualification || "",
          address: data.address || "",
          state: data.state || "",
          nationality: data.nationality || "",
          college_hospital: data.college_hospital || "",
          category: data.category || "",
          achievements: data.achievements || "",
          bio_details: data.bio_details || "",
        });
      } else if (response.status === 404) {
        // No user details found, prefill only names
        setUserData(null);
        prefillNameFromSession();
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // On error, prefill only names
      prefillNameFromSession();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.prefix.trim()) newErrors.prefix = "Prefix is required";
    if (formData.prefix === "Other" && !formData.other_prefix.trim()) {
      newErrors.other_prefix = "Other prefix is required";
    }
    if (!formData.firstname.trim()) newErrors.firstname = "First Name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last Name is required";
    if (!formData.specialization.trim())
      newErrors.specialization = "Specialization is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.qualification.trim())
      newErrors.qualification = "Qualification is required";
    if (!/^\d{10}$/.test(formData.phonenumber))
      newErrors.phonenumber = "Phone Number must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";
    if (!formData.college_hospital.trim())
      newErrors.college_hospital = "College/Hospital name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validateForm()) {
      setActiveTab("biodata");
    }
  };

  const handleBioDetailsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bio_details: value }));
  };

  const handleAchievementsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, achievements: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const formDataToSend = new FormData();
      formDataToSend.append("user_id", userId);
      Object.entries(formData).forEach(([key, value]) =>
        formDataToSend.append(key, value)
      );

      const response = await fetch("/api/userdetails", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || `Failed to ${userData ? "update" : "create"} user details`
        );

      setSuccess(`User details ${userData ? "updated" : "created"} successfully`);
      localStorage.setItem("profileSuccess", "true");
      localStorage.setItem("profileCompleted", "1");
 // ✅ Add this line
      setTimeout(() => router.push("/user/dashboard"), 500); 
      setUserData(data.user);
      setActiveTab("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return <div className="text-center py-4">Loading...</div>;

  return (
    <UserLayout>
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <UserCircle className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold">
                {userData
                  ? `${userData.prefix
                      ? userData.prefix === "Other"
                        ? userData.other_prefix || ""
                        : userData.prefix
                      : "Dr."
                    } ${userData.firstname || ""} ${userData.lastname || ""}`.trim()
                  : "User"}
              </h3>
              {/* ✅ Role, ID and other info remain unchanged */}
              <p className="text-gray-500 capitalize">
                {userData?.designation || session.user?.role || "User"}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                User ID: {userData?.user_id || session.user?.id}
              </p>




              {/* <p className="text-gray-500">{session.user?.role}</p> */}
              {/* <p className="text-gray-400 text-sm mt-1">
                User ID: {session.user?.id}
              </p> */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{session.user?.email}</span>
                </div>
                <div className="flex items-center justify-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Joined:{" "}
                    {new Date(session.user?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b flex">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 px-6 py-3 text-lg font-medium ${activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  User Details
                </button>
                <button
                  onClick={() => setActiveTab("biodata")}
                  className={`flex items-center gap-2 px-6 py-3 text-lg font-medium ${activeTab === "biodata"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Bio Data
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded mb-6">{error}</div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-500 p-4 rounded mb-6">
                    {success}
                  </div>
                )}

                {/* --- Profile Form --- */}
                {activeTab === "profile" && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Prefix*
                        </label>
                        <select
                          name="prefix"
                          value={formData.prefix}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                        >
                          <option value="">Select Designation</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Asst. Prof">Asst. Prof</option>
                          <option value="Prof">Prof</option>
                          <option value="Reader">Reader</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.prefix && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.prefix}
                          </p>
                        )}
                      </div>
                      {formData.prefix === "Other" && (
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-700">
                            Other Prefix*
                          </label>
                          <input
                            type="text"
                            name="other_prefix"
                            value={formData.other_prefix}
                            onChange={handleInputChange}
                            placeholder="Enter your custom prefix"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          />
                          {errors.other_prefix && (
                            <p className="text-red-500 text-sm mt-1">{errors.other_prefix}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.firstname && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.lastname && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Specialization*
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          placeholder="Enter your specialization"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.specialization && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.specialization}
                          </p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Designation*
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}

                          placeholder="Enter your last name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.designation && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                        Qualification*
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        placeholder="Enter your qualification"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      {errors.qualification && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.qualification}
                        </p>
                      )}
                      </div>

                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          name="phonenumber"
                          value={formData.phonenumber}
                          onChange={handleInputChange}
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.phonenumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phonenumber}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Name of College/Hospital*
                        </label>
                        <input
                          type="text"
                          name="college_hospital"
                          value={formData.college_hospital}
                          onChange={handleInputChange}
                          placeholder="Enter your college or hospital name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.college_hospital && (
                          <p className="text-red-500 text-sm mt-1">{errors.college_hospital}</p>
                        )}
                      </div>

                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Category*
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                        >
                          <option value="">Choose</option>
                          <option value="Faculties/ Medical officers">Faculties/ Medical officers</option>
                          <option value="Private practitioners">Private practitioners</option>
                          <option value="PG/PhD Scholars">PG/PhD Scholars</option>
                          <option value="UG student / Internee">UG student / Internee</option>
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          State*
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter your state"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nationality*
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          placeholder="Enter your nationality"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.nationality && (
                          <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address*
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete address"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Next
                      </button>
                    </div>
                  </form >
                )}

                {/* --- Bio Data Form --- */}
                {
                  activeTab === "biodata" && (
                    <form
                      onSubmit={handleProfileSubmit}
                      className="space-y-6 h-[70vh] flex flex-col"
                    >
                      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        <label className="text-sm font-medium">User Summary</label>
                        <RichTextEditor
                          value={formData.bio_details}
                          onChange={handleBioDetailsChange}
                        />

                        <label className="text-sm font-medium">Achievements</label>
                        <RichTextEditor
                          value={formData.achievements}
                          onChange={handleAchievementsChange}
                        />
                      </div>

                      <div className="flex justify-end bottom-0 bg-white pt-2 border-t">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                          {isLoading ? "Saving..." : "Save Details"}
                        </button>
                      </div>
                    </form>
                  )
                }
              </div >
            </div >
          </div >
        </div >
      </div >
    </UserLayout >
  );
};

export default UserProfilePage;
