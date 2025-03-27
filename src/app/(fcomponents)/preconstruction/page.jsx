"use client";

import React from 'react';

export default function PreconstrucionPage() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F1E3C7' }}>
      <div className="max-w-4xl mx-auto bg-white/80 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-4">
          Preconstruction
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">👉 Focus</h2>
          <p className="text-lg text-gray-600 mb-4">
            The <span className="font-bold">planning and preparation phase</span> before actual construction begins.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">What is Preconstruction?</h3>
          <p className="text-gray-600">
            Preconstruction is a critical initial phase where comprehensive planning and preparation take place before any physical construction work starts.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Key Steps in Preconstruction for Rahul Nagar Society
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>
                <strong>Site Analysis & Surveys</strong>: Detailed evaluation of the existing site conditions, topography, and infrastructure.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>
                <strong>Budget Estimation</strong>: Comprehensive financial planning and cost projections for the entire redevelopment project.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>
                <strong>Legal Approvals & Compliance</strong>: Securing necessary permissions, licenses, and ensuring regulatory compliance.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>
                <strong>Risk Assessment</strong>: Identifying potential challenges and developing mitigation strategies.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              <span>
                <strong>Procurement Planning</strong>: Strategizing material procurement, vendor selection, and resource allocation.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Role of Residents in Preconstruction
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 text-green-600">•</span>
              <span>
                <strong>Providing Feedback on Designs</strong>: Participating in design review sessions and offering constructive input.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-600">•</span>
              <span>
                <strong>Attending Planning Meetings</strong>: Staying informed and engaged in the project's initial stages.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-600">•</span>
              <span>
                <strong>Understanding Temporary Inconveniences</strong>: Being prepared for potential disruptions during the redevelopment process.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Expected Start & End Dates
          </h3>
          <p className="text-gray-600">
            Specific dates to be confirmed and communicated to all residents in upcoming meetings.
          </p>
        </section>
      </div>
    </div>
  );
}