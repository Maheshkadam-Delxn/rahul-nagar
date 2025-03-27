"use client";
import React from 'react';
import { 
  Wrench, 
  Shield, 
  Droplet, 
  Zap, 
  Trash2, 
  Phone, 
  HelpCircle, 
  Clock 
} from 'lucide-react';

const PropertyMaintenancePage = () => {
  const servicesOffered = [
    {
      icon: <Droplet className="w-10 h-10 text-blue-600" />,
      title: "Plumbing Repairs",
      description: "Comprehensive plumbing maintenance and emergency repairs."
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-500" />,
      title: "Electrical Services",
      description: "Routine electrical checks and immediate repair services."
    },
    {
      icon: <Shield className="w-10 h-10 text-green-600" />,
      title: "Safety Checks",
      description: "Regular elevator and fire safety system inspections."
    },
    {
      icon: <Trash2 className="w-10 h-10 text-gray-600" />,
      title: "Waste Management",
      description: "Efficient and eco-friendly waste disposal and recycling."
    }
  ];

  const maintenanceTips = [
    "Regularly check for water leaks and report promptly",
    "Keep electrical connections clean and dry",
    "Report any unusual noises in elevators immediately",
    "Participate in community cleanliness drives",
    "Maintain proper ventilation in your apartment"
  ];

  const annualMaintenanceContracts = [
    {
      type: "Basic Maintenance",
      coverage: "Essential repairs and monthly inspections",
      price: "₹5,000 per year"
    },
    {
      type: "Comprehensive Maintenance",
      coverage: "Full-range services including emergency repairs",
      price: "₹12,000 per year"
    },
    {
      type: "Premium Maintenance",
      coverage: "24/7 support, priority service, annual deep cleaning",
      price: "₹18,000 per year"
    }
  ];

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F1E3C7' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Property Maintenance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ensuring the longevity, safety, and aesthetic appeal of Rahul Nagar Society
          </p>
        </header>

        {/* Why Maintenance is Important */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Why Maintenance Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Longevity</h3>
              <p className="text-gray-600">Proactive maintenance extends the life of infrastructure and reduces long-term repair costs.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safety</h3>
              <p className="text-gray-600">Regular checks ensure the safety of residents and prevent potential hazards.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <HelpCircle className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aesthetics</h3>
              <p className="text-gray-600">Consistent maintenance preserves the beauty and value of our community spaces.</p>
            </div>
          </div>
        </section>

        {/* Services Offered */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Services Offered
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesOffered.map((service, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Annual Maintenance Contracts */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Annual Maintenance Contracts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {annualMaintenanceContracts.map((contract, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl text-center"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{contract.type}</h3>
                <p className="text-gray-600 mb-4">{contract.coverage}</p>
                <div className="text-3xl font-bold text-blue-700">{contract.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Helpline */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Emergency Helpline
          </h2>
          <div className="flex justify-center items-center">
            <Phone className="w-12 h-12 text-red-600 mr-4" />
            <p className="text-2xl font-semibold text-gray-700">
              +91 98765 43210
            </p>
          </div>
          <p className="mt-4 text-gray-600">
            Available 24/7 for urgent repairs and immediate assistance
          </p>
        </section>

        {/* Tips for Residents */}
        <section className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Maintenance Tips for Residents
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {maintenanceTips.map((tip, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-xl flex items-center"
              >
                <HelpCircle className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyMaintenancePage;