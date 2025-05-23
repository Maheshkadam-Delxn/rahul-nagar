'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { Calendar, FileText } from "lucide-react";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import ConstructionIcon from "../../../../public/home/events/icon.png";

const BuildingPage = () => {
    const { id } = useParams();
    const [building, setBuilding] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const now = new Date();
    const upcomingEvents = building?.events?.filter(event => new Date(event.date) > now) || [];
    const pastEvents = building?.events?.filter(event => new Date(event.date) <= now) || [];
    
    // Function to format date and time
    const formatDateTime = (dateString) => {
        if (!dateString) return "No date available";
    
        const date = new Date(dateString);
    
        const year = date.getUTCFullYear();
        const day = date.getUTCDate();
        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    
        const ordinalSuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
    
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
    
        return `${day}${ordinalSuffix(day)} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm} `;
    };
    
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/building/fetchById?id=${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Check if response has content
                const text = await response.text();
                if (!text) {
                    throw new Error("Empty response from server");
                }
                
                const data = JSON.parse(text);
                setBuilding(data);
                setUpdates(data.updates || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!building) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-gray-500">No building data found</p>
            </div>
        );
    }

    // Default image fallback
    const getImageSrc = (img) => {
        return img || "/avatar.jpg";
    };
    console.log("building ",building)
    return (
        <div className='w-full min-h-screen'>
            <ServiceHeroSection
                name={`${building.name}`}
                breadcrumbs={[{ label: "Home", link: "/" }, { label: "Project", link: "/project" }]}
            />
            
            {/* Building Description */}
            {/* <div className="w-full bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">About {building.name}</h2>
                        <p className="text-gray-600">{building.description}</p>
                        <div className="mt-4 flex items-center">
                            <span className="text-gray-700 font-medium">Total Owners:</span>
                            <span className="ml-2 text-gray-600">{building.totalOwners}</span>
                        </div>
                    </div>
                </div>
            </div> */}
            
            <div className='w-full py-12 bg-white flex flex-col items-center'>
                <div className="bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-6 w-full items-start justify-center max-w-6xl">
                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                        <div className='flex flex-col items-start gap-5 w-full'>
                            <div className="flex items-center gap-4">
                                <Image 
                                    src={ConstructionIcon} 
                                    alt="Construction Icon" 
                                    width={64} 
                                    height={64} 
                                    className="w-12 h-12 md:w-16 md:h-16" 
                                />
                                <h1 className="text-lg font-semibold text-[#B57E10]">Upcoming Events</h1>
                            </div>
                            <div className="grid grid-cols-1 gap-6 w-full">
                                {upcomingEvents.map((event, index) => (
                                    <div key={index} className="rounded-lg p-5 transition duration-300 border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-black w-7 h-7" />
                                            <h3 className="text-lg font-semibold text-black">{event.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mt-2 text-sm">{event.description}</p>
                                        <p className="text-[#B57E10] mt-2 font-medium">
                                            {formatDateTime(event.date)}
                                        </p>
                                        <p className="text-gray-500 text-sm">{event.location}</p>
                                        
                                        {/* Document section - only show when documentUrl exists */}
                                        {event.documentUrl && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="text-gray-700 w-5 h-5" />
                                                    <span className="text-sm font-medium">{event.documentName || "Document"}</span>
                                                </div>
                                                <a 
                                                    href={event.documentUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Events Section */}
                    {pastEvents.length > 0 && (
                        <div className='flex flex-col items-start gap-5 w-full'>
                            <div className="flex items-center gap-4">
                                <Image 
                                    src={ConstructionIcon} 
                                    alt="Construction Icon" 
                                    width={64} 
                                    height={64} 
                                    className="w-12 h-12 md:w-16 md:h-16" 
                                />
                                <h1 className="text-lg font-semibold text-[#B57E10]">Past Events</h1>
                            </div>
                            <div className="grid grid-cols-1 gap-6 w-full">
                                {pastEvents.map((event, index) => (
                                    <div key={index} className="rounded-lg p-5 transition duration-300 border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-black w-7 h-7" />
                                            <h3 className="text-lg font-semibold text-black">{event.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mt-2 text-sm">{event.description}</p>
                                        <p className="text-[#B57E10] mt-2 font-medium">
                                            {formatDateTime(event.date)}
                                        </p>
                                        <p className="text-gray-500 text-sm">{event.location}</p>
                                        
                                        {/* Document section - only show when documentUrl exists */}
                                        {event.documentUrl && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="text-gray-700 w-5 h-5" />
                                                    <span className="text-sm font-medium">{event.documentName || "Document"}</span>
                                                </div>
                                                <a 
                                                    href={event.documentUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Updates Section */}
                    {/* {building.updates && building.updates.length > 0 && (
                        <div className="w-full py-8">
                            <div className="flex items-center gap-4 mb-6">
                                <Image 
                                    src={ConstructionIcon} 
                                    alt="Updates Icon" 
                                    width={64} 
                                    height={64} 
                                    className="w-12 h-12 md:w-16 md:h-16" 
                                />
                                <h1 className="text-lg font-semibold text-[#B57E10]">Recent Updates</h1>
                            </div>
                            <div className="space-y-4">
                                {building.updates.map((update, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-800">{update.title}</h3>
                                        <p className="text-gray-600 mt-2">{update.description}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(update.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Leadership Team Section */}
                    <div className="w-full bg-white px-4 md:px-0 py-12">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="w-full flex flex-col items-center gap-5">
                                <div className="flex items-center w-full justify-center gap-1 text-[#B57E10]">
                                    <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
                                    <h1 className="text-sm md:text-base">Leadership Team</h1>
                                    <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                                    Building Association Heads
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Chairman", name: building.president, image: getImageSrc(building.presidentImage) },
                                    { title: "Secretary", name: building.secretary, image: getImageSrc(building.secretaryImage) },
                                    { title: "Treasurer", name: building.treasurer, image: getImageSrc(building.treasurerImage) },
                                ].map((role, index) => (
                                    <div key={index} className="bg-gray-300 rounded-lg w-full h-64 md:h-96 flex flex-col justify-end relative overflow-hidden shadow-lg">
                                        <Image
                                            alt={`${role.title} Image`}
                                            src={role.image}
                                            width={1920}
                                            height={1080}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/home/building/icon.svg";
                                            }}
                                        />
                                        <div className="bg-gray-700 text-white p-4 absolute bottom-0 left-0 right-0 flex flex-col gap-2">
                                            <p className="font-bold text-2xl">{role.name || "Not Assigned"}</p>
                                            <p className="text-xs md:text-sm">{role.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Owners Section */}
                    {building.owners?.length > 0 && (
                        <div className="w-full py-12 flex flex-col items-center justify-center"> 
                            <div className="max-w-6xl w-full px-6 md:px-12 flex flex-col items-start gap-14">
                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className="text-2xl font-bold">Flat / Shop Owners of {building.name}</h2>
                                    <hr className="my-4 border-gray-300 w-2/3" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
                                    {building.owners.map((owner, index) => (
                                        <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
                                            <Image 
                                                src={"/home/building/icon.svg"} 
                                                alt="Resident Icon" 
                                                width={48} 
                                                height={48} 
                                                className="w-12 h-12"
                                            />
                                            <div>
                                                <h3 className="text-lg font-bold">{owner.name || "Unknown"}</h3>
                                                <p className="text-gray-600 text-sm">{owner.flatNumber || "N/A"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuildingPage;