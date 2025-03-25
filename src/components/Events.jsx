"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MoveRight } from "lucide-react";
import ConstructionIcon from "../../public/home/events/icon.png";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Events
                const eventsRes = await fetch("/api/events/fetchAll");
                if (!eventsRes.ok) throw new Error("Failed to fetch events");
                const eventsData = await eventsRes.json();
                setEvents(eventsData.events);

                // Fetch Latest Updates
                const updatesRes = await fetch("/api/updates/fetchAll");
                if (!updatesRes.ok) throw new Error("Failed to fetch updates");
                const updatesData = await updatesRes.json();
                setUpdates(updatesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    console.log(updates)
    return (
        <div className="w-full bg-[#f8f8f8] min-h-screen flex items-center justify-center py-24">
            <div className="w-full max-w-6xl flex flex-col items-center gap-10 px-4">
                {/* Heading Section */}
                <div className="flex flex-col items-start gap-5 w-full">
                    <div className="flex items-center gap-1 text-[#B57E10]">
                        <hr className="w-12 border-t border-2 rounded-full" />
                        <h1>What We Do</h1>
                    </div>
                    <div className="flex items-center w-full justify-between">
                        <h1 className="text-3xl font-bold text-center">Latest Updates & Upcoming Events</h1>
                        <Link href={"#"} className="bg-[#B57E10] p-3 text-white rounded-sm text-sm font-medium">
                            More About Us
                        </Link>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-5">
                    {/* Latest Updates Card */}
                    <div className="flex-1 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-5">
                            <Image src={ConstructionIcon} alt="ConstructionIcon" width={64} height={64} className="w-16 h-16" />
                            <h1 className="text-lg text-[#B57E10] font-medium">Latest Updates of Redevelopment</h1>
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            {updates?.length > 0 ? (
                                updates.map((update) => (
                                    <div key={update.id} className="flex flex-col gap-3">
                                        <div className="flex items-center gap-5 text-sm text-gray-600">
                                            <div className="flex items-center gap-2"><User size={16} color="red" />{update.createdBy.userRole}</div>
                                            <div className="flex items-center gap-2">
  <Calendar size={16} color="red" />
  {updates?.createdAt 
    ? new Date(updates.createdAt).toLocaleDateString("en-GB") 
    : "Invalid Date"}
</div>


                                        </div>
                                        <h1 className="text-xl font-bold">{update.title}</h1>
                                        <p className="text-sm opacity-45 font-medium">{update.content}</p>
                                        <Link href={"#"} className="flex items-center gap-2 text-sm text-[#B57E10]">
                                            Read More <MoveRight size={20} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No latest updates.</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events Card */}
                    <div className="flex-1 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-5">
                            <Image src={ConstructionIcon} alt="ConstructionIcon" width={64} height={64} className="w-16 h-16" />
                            <h1 className="text-lg text-[#B57E10] font-medium">Upcoming Events / Meetings</h1>
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <div key={event._id} className="flex flex-col gap-3">
                                        <div className="flex items-center gap-5 text-sm text-gray-600">
                                            <div className="flex items-center gap-2"><User size={16} color="red" />By Admin</div>
                                            <div className="flex items-center gap-2"><Calendar size={16} color="red" />{new Date(event.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                            <Image src={event.image} alt={event.title} width={200} height={100} className="w-44 md:w-32 rounded-lg h-28 object-cover" />
                                            <div className="flex flex-col gap-2">
                                                <h1 className="text-xl font-bold">{event.title}</h1>
                                                <p className="text-sm opacity-45 font-medium">{event.description}</p>
                                                <Link href={"#"} className="flex items-center gap-2 text-sm text-[#B57E10]">
                                                    Read More <MoveRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No upcoming events.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;
