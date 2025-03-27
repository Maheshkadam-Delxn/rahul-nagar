"use client";
import React from 'react';
import { Building, Shield, Leaf, Clock, HelpCircle } from 'lucide-react';

const GeneralConstructionPage = () => {
  const scopeOfWork = [
    {
      icon: <Building className="w-10 h-10 text-gray-700" />,
      title: "Residential Tower Construction",
      description: "Comprehensive construction of modern residential towers with state-of-the-art design and infrastructure.",
      bgPattern: "bg-white/80 rounded-md"
    },
    {
      icon: <Shield className="w-10 h-10 text-gray-700" />,
      title: "Structural Enhancements",
      description: "Implementing advanced structural reinforcements to ensure long-term durability and safety.",
      bgPattern: "bg-white/80 rounded-md"
    },
    {
      icon: <Leaf className="w-10 h-10 text-gray-700" />,
      title: "Sustainable Materials",
      description: "Utilizing eco-friendly and energy-efficient materials to minimize environmental impact.",
      bgPattern: "bg-white/80 rounded-md"
    }
  ];

  const technologies = [
    "Earthquake-Resistant Design",
    "BIM (Building Information Modeling)",
    "Green Building Certification",
    "Advanced Structural Engineering"
  ];

  const projectTimeline = [
    { phase: "Planning & Design", duration: "6 months" },
    { phase: "Foundation Work", duration: "4 months" },
    { phase: "Structure Erection", duration: "8 months" },
    { phase: "Interior & Finishing", duration: "6 months" }
  ];

  const faqs = [
    {
      question: "What safety measures are being implemented?",
      answer: "We are using earthquake-resistant techniques, fire safety systems, and comprehensive structural integrity checks."
    },
    {
      question: "How long will the construction take?",
      answer: "The entire project is estimated to take approximately 24 months from start to completion."
    },
    {
      question: "Are you using sustainable construction methods?",
      answer: "Yes, we are committed to green building practices, using sustainable materials and energy-efficient design principles."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1E3C7' }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 bg-white/80 p-6 rounded-2xl shadow-sm">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            General Construction
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming Rahul Nagar Society through innovative, sustainable, and precise construction techniques
          </p>
        </header>

        {/* Scope of Work */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Scope of Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {scopeOfWork.map((item, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${item.bgPattern}`}
              >
                <div className="flex items-center mb-4 ">
                  {item.icon}
                  <h3 className="ml-4 text-xl font-semibold text-gray-800">{item.title}</h3>
                </div>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section className="mb-16 bg-white/80 py-12 px-6 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Technologies & Innovations
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <span 
                key={index} 
                className="bg-white/70 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Project Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Project Timeline
          </h2>
          <div className="bg-white/80 rounded-2xl shadow-lg p-8">
            {projectTimeline.map((phase, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center border-b last:border-b-0 py-4 border-gray-200"
              >
                <span className="text-lg font-medium text-gray-800">{phase.phase}</span>
                <span className="text-gray-600">{phase.duration}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/80 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <HelpCircle className="mr-3 text-gray-600" />
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl">
            Learn More About Our Construction Process
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralConstructionPage;