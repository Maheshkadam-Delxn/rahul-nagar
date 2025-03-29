'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MoveRight } from "lucide-react";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import ConstructionIcon from "../../../../public/home/events/icon.png";

const BuildingPageSkeleton = () => {
  return (
      <div className='w-full min-h-screen'>
          <ServiceHeroSection
              name="Loading Building Details"
              breadcrumbs={[{ label: "Home", link: "/" }, { label: "Project", link: "/project" }]}
          />

          <div className='w-full py-12 bg-white flex flex-col items-center'>
              <div className='w-full max-w-6xl flex flex-col items-start gap-14'>
                  <div className='w-full px-6 md:px-12'>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                          {/* Main Content Skeleton */}
                          <div className='md:col-span-2'>
                              {/* Image Skeleton */}
                              <div className='w-full h-64 bg-gray-300 rounded-lg animate-pulse'></div>
                              
                              {/* Title Skeleton */}
                              <div className='h-8 bg-gray-200 w-1/2 mt-6 mb-4 animate-pulse'></div>
                              
                              {/* Description Skeleton */}
                              <div className='space-y-2'>
                                  <div className='h-4 bg-gray-200 w-full animate-pulse'></div>
                                  <div className='h-4 bg-gray-200 w-5/6 animate-pulse'></div>
                                  <div className='h-4 bg-gray-200 w-4/5 animate-pulse'></div>
                              </div>
                              
                              {/* Events Skeleton */}
                              <div className='mt-4'>
                                  <div className='h-6 bg-gray-200 w-1/3 mb-2 animate-pulse'></div>
                                  <div className='space-y-2'>
                                      <div className='h-4 bg-gray-200 w-full animate-pulse'></div>
                                      <div className='h-4 bg-gray-200 w-5/6 animate-pulse'></div>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Sidebar Skeleton */}
                          <div className='bg-white shadow-lg rounded-lg overflow-hidden h-fit'>
                              <div className='bg-[#b5831d] text-white px-4 py-3 text-lg font-bold'>Loading...</div>
                              <div className='p-4 space-y-4'>
                                  <div className='h-6 bg-gray-200 w-full animate-pulse'></div>
                                  <hr className='my-2' />
                                  <div className='h-6 bg-gray-200 w-full animate-pulse'></div>
                                  <hr className='my-2' />
                                  <div className='h-6 bg-gray-200 w-full animate-pulse'></div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Updates Skeleton */}
                  <div className="flex-1 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-5">
                      <div className="flex items-center gap-5">
                          <div className='w-16 h-16 bg-gray-300 animate-pulse rounded-full'></div>
                          <div className='h-6 bg-gray-200 w-1/2 animate-pulse'></div>
                      </div>
                      <div className="flex flex-col gap-5 w-full">
                          {[1, 2, 3].map((_, index) => (
                              <div key={index} className="flex flex-col gap-3">
                                  <div className="flex items-center gap-5 text-sm text-gray-600">
                                      <div className='h-4 bg-gray-200 w-1/4 animate-pulse'></div>
                                      <div className='h-4 bg-gray-200 w-1/4 animate-pulse'></div>
                                  </div>
                                  <div className='h-6 bg-gray-200 w-1/2 animate-pulse'></div>
                                  <div className='h-4 bg-gray-200 w-full animate-pulse'></div>
                                  <div className='h-4 bg-gray-200 w-3/4 animate-pulse'></div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Owners Skeleton */}
                  <div className="w-full py-12 flex flex-col">
                      <div className="max-w-6xl w-full px-6 md:px-12 flex flex-col items-start gap-14">
                          <div className='flex flex-col items-start gap-2'>
                              <div className='h-8 bg-gray-200 w-1/2 animate-pulse'></div>
                              <hr className="my-4 border-gray-300 w-2/3" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                  <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
                                      <div className='w-12 h-12 bg-gray-300 animate-pulse rounded-full'></div>
                                      <div className='space-y-2'>
                                          <div className='h-5 bg-gray-200 w-32 animate-pulse'></div>
                                          <div className='h-4 bg-gray-200 w-24 animate-pulse'></div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
const BuildingPage = () => {
    const { id } = useParams();
    const [building, setBuilding] = useState(null);
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
      if (!id) return; // Prevent fetching if id is undefined
  
      const fetchData = async () => {
          try {
              const response = await fetch(`/api/building/fetchById?id=${id}`);
              if (!response.ok) throw new Error("Failed to fetch building data");
              
              const data = await response.json();
              setBuilding(data);
              setUpdates(data.updates || []);
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };
  
      fetchData();
  }, [id]);
  console.log(building)
    if (!building) return <BuildingPageSkeleton/>;

    return (
        <div className='w-full min-h-screen'>
            <ServiceHeroSection
                name={`${building.name}`}
                breadcrumbs={[{ label: "Home", link: "/" }, { label: "Project", link: "/project" }]}
            />

            <div className='w-full py-12 bg-white flex flex-col items-center'>
                <div className='w-full max-w-6xl flex flex-col items-start gap-14'>
                    <div className='w-full px-6 md:px-12'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='md:col-span-2'>
                                <div className='w-full h-64 bg-gray-300 rounded-lg'><Image src={building.image} width={1920} height={1080} className='w-full h-full object-cover'/></div>
                               { building?.description ?  <h2 className='text-2xl font-bold mt-6'>About {building.name}</h2> :  <h2 className='text-2xl font-bold mt-6'>{building.name}</h2>}
                                <p className='text-gray-700 mt-2'>{building.description}</p>
                                {
                                    building?.events?.length>0 ?<div className='flex flex-col items-start'> <h3 className='text-xl font-bold mt-4'>Events Conducted</h3>
                                    <ul className='list-disc list-inside text-gray-700 mt-2 space-y-1'>
                                        {building.events?.map((event, index) => (
                                            <li key={index}><strong>{event.title}</strong> {event.description}</li>
                                        ))}
                                    </ul></div> :  null
                                }
                            </div>
                            <div className='bg-white shadow-lg rounded-lg overflow-hidden h-fit '>
                                <div className='bg-[#b5831d] text-white px-4 py-3 text-lg font-bold'>{building.name}</div>
                                <div className='p-4'>
                                    {building.president === "none" ? null : <div className='flex flex-col items-start gap-2'>
                                      <p className='text-gray-700'><span className='font-semibold'>Chairman:</span> <strong>{building.president}</strong></p>
                                      <hr className='my-2' />
                                      </div>}
                                      {
                                        building.secretary==="none"?null: <div className='flex flex-col items-start gap-1'>
                                           <p className='text-gray-700'><span className='font-semibold'>Secretary:</span> <strong>{building.secretary}</strong></p>
                                           <hr className='my-2' />
                                        </div>
                                      }
                                    {
                                      building.treasurer ==="none"?null:  <p className='text-gray-700'><span className='font-semibold'>Treasurer:</span> <strong>{building.treasurer}</strong></p>
                                    }
                                   
                                </div>
                            </div>
                        </div>
                    </div>

                   {
                    updates?.length>0 &&  <div className="flex-1 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-5">
                        <Image src={ConstructionIcon} alt="ConstructionIcon" width={64} height={64} className="w-16 h-16" />
                        <h1 className="text-lg text-[#B57E10] font-medium">Latest Updates of Redevelopment</h1>
                    </div>
                    <div className="flex flex-col gap-5 w-full">
                        {updates.length > 0 ? (
                            updates.map((update) => (
                                <div key={update.id} className="flex flex-col gap-3">
                                    <div className="flex items-center gap-5 text-sm text-gray-600">
                                        <div className="flex items-center gap-2"><User size={16} color="red" />{update.role}</div>
                                        <div className="flex items-center gap-2"><Calendar size={16} color="red" />{new Date(update.date).toLocaleDateString()}</div>
                                    </div>
                                    <h1 className="text-xl font-bold">{update.title}</h1>
                                    <p className="text-sm opacity-45 font-medium">{update.content}</p>
                                    <Link href={update.link || "#"} className="flex items-center gap-2 text-sm text-[#B57E10]">
                                        Read More <MoveRight size={20} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No latest updates.</p>
                        )}
                    </div>
                </div>
                   }

                    <div className="w-full py-12 flex flex-col ">
                        <div className="max-w-6xl w-full px-6 md:px-12 flex flex-col items-start gap-14">
                            <div className='flex flex-col items-start gap-2'>
                                <h2 className="text-2xl font-bold text-center">Flat / Shop Owners of {building.name}</h2>
                                <hr className="my-4 border-gray-300 w-2/3 " />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {building.owners?.map((owner, index) => (
                                    <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
                                        <img src={"/home/building/icon.svg"} alt="Resident Icon" className="w-12 h-12" />
                                        <div>
                                            <h3 className="text-lg font-bold">{owner.name}</h3>
                                            <p className="text-gray-600 text-sm">{owner.flatNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildingPage;