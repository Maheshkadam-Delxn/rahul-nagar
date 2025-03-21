import React from 'react'
import Image from 'next/image'

const Stats = () => {
    const StatsData = [
        {
            id: 1,
            Stat: "1993",
            logo: "/home/stats/icon.png",
            desc: "Establishment Year"
        },
        {
            id: 2,
            Stat: "262",
            logo: "/home/stats/flatowner.png",
            desc: "Flat Owners"
        },
        {
            id: 3,
            Stat: "4.5 Acres",
            logo: "/home/stats/acres.png",
            desc: "Of Land Parcel"
        },
    ]
    
    return (
        <div className='w-full bg-[#B57E10] flex flex-col items-center justify-center py-8 md:py-12'>
            <div className='w-full max-w-6xl px-4 md:px-6 text-white'>
                {/* Mobile Layout */}
                <div className='flex flex-col gap-8 md:hidden'>
                    {StatsData.map((stat) => (
                        <div key={stat.id} className='flex items-center gap-4'>
                            <Image 
                                src={stat.logo} 
                                alt={stat.desc} 
                                width={64} 
                                height={64} 
                                className='w-12 h-12 object-contain'
                            />
                            <div className='flex flex-col items-start gap-1'>
                                <h1 className='text-3xl font-bold'>{stat.Stat}</h1>
                                <p className='text-base opacity-90'>{stat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Tablet/Desktop Layout */}
                <div className='hidden md:flex md:flex-wrap lg:flex-nowrap items-center justify-between'>
                    {StatsData.map((stat, index) => (
                        <React.Fragment key={stat.id}>
                            {/* Stat Box */}
                            <div className='flex items-center text-center gap-4 md:gap-5'>
                                <Image 
                                    src={stat.logo} 
                                    alt={stat.desc} 
                                    width={80} 
                                    height={80} 
                                    className='w-12 lg:w-16 h-auto object-contain'
                                />
                                <div className='flex flex-col items-start gap-1 md:gap-2'>
                                    <h1 className='text-3xl lg:text-4xl font-bold'>{stat.Stat}</h1>
                                    <p className='text-lg lg:text-xl opacity-90'>{stat.desc}</p>
                                </div>
                            </div>
                            
                            {/* Divider - Do not add after last element */}
                            {index < StatsData.length - 1 && (
                                <div className="h-12 lg:h-16 w-[2px] bg-white mx-2 lg:mx-4"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Stats;