import Link from 'next/link'
import React from 'react'
import ConstructionIcon from "../../public/home/events/icon.png"
import Image from 'next/image'
import { User, Calendar, MoveRight } from 'lucide-react'

const RedevelopmentUpdates = [
    {
        id: 1,
        from: "By Admin",
        Date: "26 January, 2024",
        title: "Redevelopment Workshop for Rahul Nagar",
        desc: "There are many variations of passages of Lorem Ipsum available There are many variations of passages of Lorem Ipsum available..."
    },
    {
        id: 2,
        from: "By Admin",
        Date: "26 January, 2024",
        title: "Redevelopment Workshop for Rahul Nagar",
        desc: "There are many variations of passages of Lorem Ipsum available There are many variations of passages of Lorem Ipsum available..."
    }
]

const EventUpdates = [
    {
        id: 1,
        from: "By Admin",
        Date: "26 January, 2024",
        title: "Redevelopment Workshop",
        desc: "There are many variations of passages of Lorem Ipsum available There are many variations of passages of Lorem Ipsum available..."
    },
    {
        id: 2,
        from: "By Admin",
        Date: "26 January, 2024",
        title: "Redevelopment Workshop",
        desc: "There are many variations of passages of Lorem Ipsum available There are many variations of passages of Lorem Ipsum available..."
    }
]

const Events = () => {
    return (
        <div className='w-full bg-[#f8f8f8] min-h-screen flex items-center justify-center py-24'>
            <div className='w-full max-w-6xl flex flex-col items-center gap-10 px-4'>
                {/* Heading Section */}
                <div className='flex flex-col items-start gap-5 w-full'>
                    <div className='flex items-center gap-1 text-[#B57E10]'>
                        <hr className='w-12 border-t border-2 rounded-full' />
                        <h1>What We Do</h1>
                    </div>
                    <div className='flex items-center w-full justify-between '>
                        <h1 className='text-3xl font-bold text-center'>Latest Updates & Upcoming Events</h1>
                        <Link href={"#"} className='bg-[#B57E10] p-3 text-white rounded-sm text-sm font-medium'>More About Us</Link>
                    </div>
                </div>

                {/* Cards Section */}
                <div className='w-full flex flex-col md:flex-row items-stretch justify-center gap-5'>
                    {/* Latest Updates Card */}
                    <div className='flex-1 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-5'>
                        <div className='flex items-center gap-5'>
                            <Image src={ConstructionIcon} alt='ConstructionIcon' width={64} height={64} className='w-16 h-16' />
                            <h1 className='text-lg text-[#B57E10] font-medium'>Latest Updates of Redevelopment</h1>
                        </div>
                        <div className='flex flex-col gap-5 w-full'>
                            {RedevelopmentUpdates.map((update) => (
                                <div key={update.id} className='flex flex-col gap-3'>
                                    <div className='flex items-center gap-5 text-sm text-gray-600'>
                                        <div className='flex items-center gap-2'><User size={16} color='red' />{update.from}</div>
                                        <div className='flex items-center gap-2'><Calendar size={16} color='red' />{update.Date}</div>
                                    </div>
                                    <h1 className='text-xl font-bold'>{update.title}</h1>
                                    <p className='text-sm opacity-45 font-medium'>{update.desc}</p>
                                    <Link href={"#"} className='flex items-center gap-2 text-sm text-[#B57E10]'>Read More <MoveRight size={20} /></Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events Card */}
                    <div className='flex-1 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-5'>
                        <div className='flex items-center gap-5'>
                            <Image src={ConstructionIcon} alt='ConstructionIcon' width={64} height={64} className='w-16 h-16' />
                            <h1 className='text-lg text-[#B57E10] font-medium'>Upcoming Events / Meetings</h1>
                        </div>
                        <div className='flex flex-col gap-5 w-full'>
                            {EventUpdates.map((update) => (
                                <div key={update.id} className='flex flex-col gap-3'>
                                    <div className='flex items-center gap-5 text-sm text-gray-600'>
                                        <div className='flex items-center gap-2'><User size={16} color='red' />{update.from}</div>
                                        <div className='flex items-center gap-2'><Calendar size={16} color='red' />{update.Date}</div>
                                    </div>
                                    <div className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                                        <div className='w-full md:w-72 rounded-lg h-28 bg-gray-300'></div>
                                        <div className='flex flex-col gap-2'>
                                            <h1 className='text-xl font-bold'>{update.title}</h1>
                                            <p className='text-sm opacity-45 font-medium'>{update.desc}</p>
                                            <Link href={"#"} className='flex items-center gap-2 text-sm text-[#B57E10]'>Read More <MoveRight size={20} /></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Events
