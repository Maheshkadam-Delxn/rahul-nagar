"use client"
import React,{useEffect,useState} from "react";
import { useRouter } from "next/navigation";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import CheckIcon from "../../../public/home/about/check.png";
import Image from "next/image";
import BuildingMap1 from "../../../public/home/layout/layout1.png";
import BuildingMap2 from "../../../public/home/layout/layout2.png";
import BuildingMap3 from "../../../public/home/layout/layout3.png";
import BuildingMap4 from "../../../public/home/layout/layout4.png";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
const page = () => {
    const maps = [BuildingMap1, BuildingMap2, BuildingMap3, BuildingMap4];
    const [buildings, setBuildings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const fetchBuildings = async () => {
          try {
            const response = await fetch("/api/building/fetchAll");
            if (!response.ok) {
              throw new Error("Failed to fetch buildings");
            }
            const data = await response.json();
            setBuildings(data);
          } catch (error) {
            console.error("Error fetching buildings:", error);
          } finally {
            setLoading(false);
          }
        };
      
        const fetchUsers = async () => {
          try {
            const response = await fetch("/api/user-management/users");
            if (!response.ok) {
              throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            console.log(data)
            setUsers(data.users);
          } catch (error) {
            console.error("Error fetching users:", error);
          } finally {
            setUserLoading(false);
          }
        };
        
        fetchBuildings();
        fetchUsers();
      }, []);

    const contactDetails = [
        {
            icon: <Phone className="text-yellow-700 w-8 h-8 md:w-10 md:h-10" />,
            title: "Phone Number",
            subtitle: "Phone",
        },
        {
            icon: <Mail className="text-yellow-700 w-8 h-8 md:w-10 md:h-10" />,
            title: "Email Address",
            subtitle: "email",
        },
        {
            icon: <MapPin className="text-yellow-700 w-8 h-8 md:w-10 md:h-10" />,
            title: "Our Location",
            subtitle: "Location",
        },
        {
            icon: <Clock className="text-yellow-700 w-8 h-8 md:w-10 md:h-10" />,
            title: "Office Hours",
            subtitle: "Mon - Sat: 09am - 07pm",
        },
    ];
  
    return (
        <div className="w-full min-h-screen">
            <ServiceHeroSection
                name="About Rahul Nagar"
                breadcrumbs={[
                    { label: "Home", link: "/" },
                    { label: "About Us", link: "/about" },
                ]}
            />

            {/* ABOUT US */}
            <div className="w-full h-full bg-white py-12 md:py-24 px-4 md:px-0 flex flex-col items-center justify-center">
                <div className="w-full h-full max-w-6xl flex flex-col items-center gap-12 md:gap-18">
                    {/* Left Image Section */}
                    <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-10">
                        <div className="w-full md:w-1/2 h-[250px] md:h-[350px] rounded-2xl bg-gray-300"></div>

                        {/* Right Content Section */}
                        <div className="w-full md:w-1/2 mt-6 md:mt-0">
                            <div className="flex items-center gap-1 text-[#B57E10] mx-auto md:mx-0">
                                <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
                                <h1 className="text-sm md:text-base">About Rahul Nagar</h1>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mt-2">
                                Brief History of Rahul Nagar
                            </h2>
                            <p className="text-gray-600 mt-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                euismod, nunc ac cursus tristique, libero purus aliquam libero,
                                ac ultrices purus lectus id purus. Cras euismod, ligula ut
                                feugiat sollicitudin, eros ex vulputate risus, eget consectetur
                                lorem nisi ac ligula. Fusce non scelerisque mi.
                            </p>

                            {/* Bullet Points Section */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-base md:text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={CheckIcon}
                                        width={1920}
                                        height={1080}
                                        alt="Check Icon"
                                        className="w-5 md:w-6"
                                    />{" "}
                                    Market Research
                                </div>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={CheckIcon}
                                        width={1920}
                                        height={1080}
                                        alt="Check Icon"
                                        className="w-5 md:w-6"
                                    />{" "}
                                    Industrial Manufacturing
                                </div>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={CheckIcon}
                                        width={1920}
                                        height={1080}
                                        alt="Check Icon"
                                        className="w-5 md:w-6"
                                    />{" "}
                                    Pre-construction Services
                                </div>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={CheckIcon}
                                        width={1920}
                                        height={1080}
                                        alt="Check Icon"
                                        className="w-5 md:w-6"
                                    />{" "}
                                    Building and Construction
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start gap-8 md:gap-14">
      <h1 className="text-3xl md:text-4xl font-bold">Layout map of Rahul Nagar</h1>
      
      <div className="w-full relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full rounded-lg overflow-hidden"
        >
          {maps.map((map, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  width={1920}
                  height={1080}
                  src={map}
                  alt={`Building Map ${index + 1}`}
                  className="w-full h-auto object-contain"
                  priority={index === 0} // Only load first image immediately
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
                </div>
            </div>

            {/* Associate Committee */}
            <div className="w-full h-full bg-white py-12 md:py-24 px-4 md:px-0 flex flex-col items-center gap-5 justify-center">
                <div className="w-full flex flex-col items-start max-w-6xl gap-10 md:gap-18">
                    <div className="w-full flex flex-col items-start gap-5">
                        <div className="flex items-center gap-1 text-[#B57E10] mx-auto md:mx-0">
                            <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
                            <h1 className="text-sm md:text-base">Association Committee</h1>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Introduction to the Association.
                        </h1>
                    </div>
                    <div className="w-full h-full max-w-6xl flex flex-col items-center gap-10 md:gap-18">
                        {/* Left Image Section */}
                        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-10">
                            <div className="w-full md:w-1/2 h-[250px] md:h-[350px] rounded-2xl bg-gray-300"></div>

                            {/* Right Content Section */}
                            <div className="w-full md:w-1/2 mt-6 md:mt-0">
                                <p className="text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                    euismod, nunc ac cursus tristique, libero purus aliquam
                                    libero, ac ultrices purus lectus id purus. Cras euismod,
                                    ligula ut feugiat sollicitudin, eros ex vulputate risus, eget
                                    consectetur lorem nisi ac ligula. Fusce non scelerisque mi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Working Members */}
            <div className="w-full bg-white px-4 md:px-0">
                <div className="max-w-6xl mx-auto text-center py-12 bg-white">
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className="flex items-center w-full justify-center gap-1 text-[#B57E10]">
                            <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
                            <h1 className="text-sm md:text-base">Working Member</h1>
                            <hr className="w-8 md:w-12 border-t-2 border-[#B57E10] rounded-full" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            Association Members
                        </h2>
                    </div>
                    {userLoading ? (
                        <div className="w-full flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B57E10]"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <p className="text-gray-500">No members found</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {users?.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-gray-300 rounded-lg w-full h-64 md:h-96 flex flex-col justify-end relative overflow-hidden"
                                >
                                    <Image
                                        alt="userImage"
                                            src={user?.image || ""}
                                            width={1920}
                                            height={1080}
                                            className="w-full h-full object-contain"
                                        />
                                    <div className="bg-gray-700 text-white p-4 absolute bottom-0 left-0 right-0">
                                        
                                        <p className="font-bold text-sm md:text-base">{user.name}</p>
                                        <p className="text-xs md:text-sm">{user.role || "Association Member"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Details */}
            <div
                className="w-full bg-white"
                style={{
                    backgroundImage: "url('/home/contact.svg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="bg-opacity-80 py-8 px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {contactDetails.map((item, index) => (
                            <div key={index} className="bg-white flex items-center gap-3 p-4 md:p-6 rounded-lg shadow-md">
                                {item.icon}
                                <div className="flex flex-col items-start">
                                    <h3 className="text-base md:text-lg font-semibold">{item.title}</h3>
                                    <p className="text-sm md:text-base text-gray-500">{item.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Building Section */}
            <div className="w-full bg-white flex items-center justify-center px-4 md:px-0">
                <div className="w-full max-w-6xl mx-auto py-12 md:py-24 bg-white text-center flex flex-col items-start gap-8 md:gap-14 justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">All buildings in Rahul Nagar</h2>
                    
                    {loading ? (
                        <div className="w-full flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B57E10]"></div>
                        </div>
                    ) : buildings.length === 0 ? (
                        <p className="text-gray-500">No buildings found</p>
                    ) : (
                        <div className="flex justify-center md:justify-start gap-4 md:gap-6 flex-wrap">
                            {buildings.map((building) => (
                                <div 
                                    key={building._id} 
                                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => router.push(`/project/${building._id}`)}
                                >
                                    <div className="relative">
                                        <Image
                                            src={"/home/about/building.png"}
                                            alt={building.name}
                                            width={1920}
                                            height={1080}
                                            className="w-36 sm:w-48 md:w-64 h-auto object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-[#B57E10] text-white text-xl md:text-2xl font-bold w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full">
                                                {building.name.split(" ").pop()}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-2 font-semibold text-sm md:text-base">Building No. {building.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default page;