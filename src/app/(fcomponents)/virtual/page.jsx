import React, { useState } from 'react';
import { 
  Cube, 
  Monitor, 
  Camera, 
  Target, 
  Layers, 
  Zap, 
  Eye 
} from 'lucide-react';

const VirtualDesignBuildPage = () => {
  const [activeModel, setActiveModel] = useState('exterior');

  const vdbBenefits = [
    {
      icon: <Target className="w-10 h-10 text-blue-600" />,
      title: "Improved Design Accuracy",
      description: "Precise digital modeling allows for meticulous planning and design refinement."
    },
    {
      icon: <Zap className="w-10 h-10 text-green-600" />,
      title: "Faster Approvals",
      description: "Comprehensive digital representations expedite approval processes with authorities."
    },
    {
      icon: <Layers className="w-10 h-10 text-purple-600" />,
      title: "Cost Optimization",
      description: "Early error detection and virtual clash prevention reduce potential construction expenses."
    }
  ];

  const vdbTechnologies = [
    {
      icon: <Cube className="w-10 h-10 text-blue-600" />,
      title: "3D Architectural Modeling",
      description: "Detailed digital representations of proposed structures and spaces."
    },
    {
      icon: <Camera className="w-10 h-10 text-green-600" />,
      title: "Virtual Reality Walkthroughs",
      description: "Immersive experiences allowing residents to explore future living spaces."
    },
    {
      icon: <Monitor className="w-10 h-10 text-purple-600" />,
      title: "Clash Detection",
      description: "Advanced software identifies potential design conflicts before construction begins."
    }
  ];

  const modelSections = [
    {
      id: 'exterior',
      name: 'Exterior View',
      placeholder: 'Exterior Model Placeholder'
    },
    {
      id: 'interior',
      name: 'Interior Layout',
      placeholder: 'Interior Layout Placeholder'
    },
    {
      id: 'amenities',
      name: 'Common Amenities',
      placeholder: 'Amenities Model Placeholder'
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
            Virtual Design & Build
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming Architectural Visualization Through Cutting-Edge Technology
          </p>
        </header>

        {/* Introduction to VDB */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            What is Virtual Design & Build?
          </h2>
          <div className="text-center max-w-4xl mx-auto text-gray-700 text-xl leading-relaxed">
            Virtual Design & Build (VDB) is an advanced technological approach that 
            integrates digital modeling, simulation, and visualization to create 
            precise, efficient, and innovative architectural solutions.
          </div>
        </section>

        {/* How VDB Helps */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            How VDB Helps Rahul Nagar Society
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {vdbTechnologies.map((tech, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  {tech.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits of VDB */}
        <section className="mb-16 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Benefits of Virtual Design & Build
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {vdbBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl flex flex-col items-center text-center"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive 3D Model Demo */}
        <section className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Interactive 3D Model
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              {modelSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveModel(section.id)}
                  className={`
                    px-4 py-2 mx-2 rounded-full transition-colors
                    ${activeModel === section.id 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                  `}
                >
                  {section.name}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Eye className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                <p className="text-xl text-gray-600">
                  {modelSections.find(m => m.id === activeModel)?.placeholder}
                </p>
                <p className="text-gray-500 mt-2">
                  (Actual 3D model to be integrated)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VirtualDesignBuildPage;