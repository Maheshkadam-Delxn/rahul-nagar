import React from 'react';
import { 
  Clipboard, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  BarChart2, 
  CheckCircle, 
  Truck 
} from 'lucide-react';

const ProjectManagementPage = () => {
  const projectStages = [
    {
      stage: "Planning",
      icon: <Clipboard className="w-10 h-10 text-blue-600" />,
      description: "Comprehensive project blueprint, stakeholder consultations, and detailed strategizing."
    },
    {
      stage: "Execution",
      icon: <Truck className="w-10 h-10 text-green-600" />,
      description: "Implementation of planned strategies, resource allocation, and active construction."
    },
    {
      stage: "Monitoring",
      icon: <BarChart2 className="w-10 h-10 text-purple-600" />,
      description: "Continuous tracking of progress, quality checks, and performance evaluation."
    },
    {
      stage: "Handover",
      icon: <CheckCircle className="w-10 h-10 text-teal-600" />,
      description: "Final quality assessment, documentation, and seamless transition to new infrastructure."
    }
  ];

  const projectManagerRoles = [
    {
      role: "Timeline Tracking",
      icon: <Clock className="w-8 h-8 text-blue-600 mr-4" />,
      description: "Ensuring strict adherence to project timelines and milestones."
    },
    {
      role: "Budget Control",
      icon: <DollarSign className="w-8 h-8 text-green-600 mr-4" />,
      description: "Maintaining financial discipline and optimizing resource allocation."
    },
    {
      role: "Vendor Coordination",
      icon: <Users className="w-8 h-8 text-purple-600 mr-4" />,
      description: "Managing relationships with contractors, suppliers, and service providers."
    },
    {
      role: "Risk Assessment",
      icon: <Shield className="w-8 h-8 text-red-600 mr-4" />,
      description: "Identifying potential challenges and developing mitigation strategies."
    }
  ];

  const qualityControlMeasures = [
    "Regular on-site inspections",
    "Third-party quality audits",
    "Adherence to national building standards",
    "Use of high-grade construction materials",
    "Continuous performance monitoring"
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
            Project Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Strategic Planning and Execution of Rahul Nagar Society Redevelopment
          </p>
        </header>

        {/* What is Project Management */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            What is Project Management?
          </h2>
          <div className="text-center max-w-4xl mx-auto text-gray-700 text-xl leading-relaxed">
            Project Management is the disciplined approach of planning, organizing, 
            and managing resources to successfully complete a project's objectives 
            within defined constraints of time, scope, and budget.
          </div>
        </section>

        {/* Role of Project Manager */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Role of the Project Manager
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projectManagerRoles.map((role, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl flex items-center"
              >
                {role.icon}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{role.role}</h3>
                  <p className="text-gray-600">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Stages */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Project Stages
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectStages.map((stage, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  {stage.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{stage.stage}</h3>
                <p className="text-gray-600">{stage.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Control Measures */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Quality Control Measures
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {qualityControlMeasures.map((measure, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-xl flex items-center"
              >
                <CheckCircle className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                <p className="text-gray-700">{measure}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Progress Reports & Updates */}
        <section className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Progress Reports & Updates
          </h2>
          <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-700 mb-4">
              We are committed to keeping our residents informed about the project's progress. 
              Regular updates will be shared through:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Monthly progress reports</li>
              <li>Community meetings</li>
              <li>Digital communication channels</li>
              <li>Dedicated project update portal</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectManagementPage;