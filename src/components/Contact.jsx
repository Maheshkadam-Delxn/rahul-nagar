import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUser, FaPencilAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 h-3/4 bg-cover bg-center object-contain w-full"
        style={{ backgroundImage: "url('/home/contact.svg')" }} // Replace with actual image path
      >
        <div className="absolute inset-0 bg-black/50"></div> {/* Dark overlay */}
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
            <h4 className="text-sm font-semibold">Lets Talk</h4>
            <h2 className="text-3xl font-bold mt-2">Have any query in Mind? Contact With Us</h2>
            <p className="mt-4 text-white/80">
              If you are going to use a passage of Lorem Ipsum, you need this to be sure there isn't anything embarrassing hidden.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10">
            <h3 className="text-2xl font-bold text-gray-800 text-center">Request A Query or Grievance</h3>
            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <FaUser className="text-gray-500 mr-2" />
                  <input type="text" placeholder="Name" className="w-full outline-none" />
                </div>
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <FaPhone className="text-gray-500 mr-2" />
                  <input type="text" placeholder="Phone Number" className="w-full outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input type="email" placeholder="Email Address" className="w-full outline-none" />
                </div>
                <div className="flex items-center border border-gray-300 p-3 rounded-md">
                  <input type="text" placeholder="Work Inquiries" className="w-full outline-none" />
                </div>
              </div>
              <div className="flex items-center border border-gray-300 p-3 rounded-md">
                <FaPencilAlt className="text-gray-500 mr-2" />
                <textarea placeholder="Query or Grievance Details" className="w-full outline-none" rows="3"></textarea>
              </div>
              <button className="w-full bg-yellow-700 text-white py-3 rounded-md font-bold">
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
