"use client";
import React from 'react';
import Image from 'next/image';
import { Quote, Star, UserCircle2 } from 'lucide-react';

const TestimonialsPage = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Resident, Block A",
      quote: "The transparency and communication throughout the redevelopment process have been exceptional. I feel genuinely heard and valued as a resident.",
      rating: 5,
      bgPattern: "bg-white/80 rounded-md"
    },
    {
      name: "Priya Sharma",
      role: "Resident, Block B",
      quote: "The sustainable design and modern amenities are exactly what our community needed. It's like we're getting a completely transformed living experience.",
      rating: 5,
      bgPattern: "bg-white/80 rounded-md"
    },
    {
      name: "Amit Patel",
      role: "Resident, Block C",
      quote: "The structural improvements and safety enhancements give me complete peace of mind. This redevelopment is a game-changer for our society.",
      rating: 4,
      bgPattern: "bg-white/80 rounded-md"
    }
  ];

  const projectHighlights = [
    "100% Resident Satisfaction Survey",
    "Transparent Communication",
    "Sustainable Design",
    "Advanced Safety Features"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1E3C7' }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 bg-white/80 p-6 rounded-2xl shadow-sm">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 flex justify-center items-center">
            <UserCircle2 className="mr-4 text-gray-600" />
            Resident Testimonials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear directly from the residents of Rahul Nagar Society about their experience with our redevelopment project
          </p>
        </header>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            What Our Residents Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${testimonial.bgPattern}`}
              >
                <Quote className="text-gray-400 mb-4" size={40} />
                <p className="text-gray-800 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Highlights */}
        <section className="mb-16 bg-white/80 py-12 px-6 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Project Highlights
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {projectHighlights.map((highlight, index) => (
              <span 
                key={index} 
                className="bg-white/70 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-md"
              >
                {highlight}
              </span>
            ))}
          </div>
        </section>

        {/* Survey Results */}
        <section className="bg-white/80 rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Resident Satisfaction Survey
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl">
              <p className="text-2xl font-bold text-gray-800 mb-4">98% Overall Satisfaction</p>
              <p className="text-gray-700">Based on comprehensive feedback from Rahul Nagar Society residents</p>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl">
            Share Your Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;