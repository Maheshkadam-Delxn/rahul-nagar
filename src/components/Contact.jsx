"use client"
import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUser, FaPencilAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiry: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', phone: '', email: '', inquiry: '', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 h-3/4 bg-cover bg-center object-contain w-full" style={{ backgroundImage: "url('/home/contact.svg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center py-12">
        {/* Contact Info Cards */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          {[
            { icon: <FaPhone />, title: 'Phone Number', subtitle: 'Phone' },
            { icon: <FaEnvelope />, title: 'Email Address', subtitle: 'email' },
            { icon: <FaMapMarkerAlt />, title: 'Our Location', subtitle: 'Location' },
            { icon: <FaClock />, title: 'Office Hours', subtitle: 'Mon - Sat: 09am - 07pm' }
          ].map((item, index) => (
            <div key={index} className="bg-white shadow-lg p-6 flex items-center rounded-lg">
              <div className="text-yellow-500 text-3xl">{item.icon}</div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-500">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg mt-12 flex flex-col md:flex-row">
          {/* Left Side - Info */}
          <div className="w-full md:w-1/2 bg-yellow-500 text-white p-10 rounded-l-lg">
            <h4 className="text-sm font-semibold">Let's Talk</h4>
            <h2 className="text-3xl font-bold mt-2">Have any query in Mind? Contact With Us</h2>
            <p className="mt-4 text-white/80">
              If you are going to use a passage of Lorem Ipsum, you need this to be sure there isn't anything embarrassing hidden.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10">
            <h3 className="text-2xl font-bold text-gray-800 text-center">Request A Query or Grievance</h3>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <FaUser className="text-gray-500 mr-2" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full outline-none" required />
                </div>
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <FaPhone className="text-gray-500 mr-2" />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full outline-none" required />
                </div>
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <input type="text" name="inquiry" value={formData.inquiry} onChange={handleChange} placeholder="Work Inquiries" className="w-full outline-none" />
                </div>
              </div>
              <div className="flex items-center border border-gray-300 p-3 rounded-md">
                <FaPencilAlt className="text-gray-500 mr-2" />
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Query or Grievance Details" className="w-full outline-none" rows="3" required></textarea>
              </div>
              <button className="w-full bg-yellow-700 text-white py-3 rounded-md font-bold">Submit Message</button>
            </form>

            {/* Status Message */}
            {status && (
              <div className={`mt-4 p-3 text-center rounded-md ${status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
