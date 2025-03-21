import React from "react";
import { MoveLeft ,MoveRight,Play} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const HeroSection = () => {
  return (
    <div className="w-full h-[85vh] flex items-center justify-center text-white">
      <div className="w-full flex items-center justify-between ">
      <MoveLeft size={48} className="p-3 border-2 border-white rounded-full"/>
      <div className="flex items-center w-4/6 justify-between ">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col items-start gap-3">
                <h2 className="text-white underline text-xl">Bulding Tomorrow,Preserving Today</h2>
                <h1 className="text-5xl font-bold leading-16">Welcome to Rahul<br/> Nagar Society</h1>
                <p>Your Gateway to a connected, Transparent, and Thriving Community</p>
                </div>
                <div className="flex items-center gap-10">
                    <Link href={"#"} className="bg-[#B57E10] p-3 text-white rounded-sm">Know more</Link>
                    <div className="flex items-center gap-2 text-sm"><div className="bg-white text-[#B57E10] p-3 rounded-full "><Play /></div>Play Now</div>
                </div>
            </div>
            <Image
            alt="logo"
                src={"/logo2.png"}
                width={1920}
                height={1080}
                className="w-2/5 h-full object-cover"
            />
      </div>
      <MoveRight size={48} className="p-3 border-2 border-white rounded-full"/>
      </div>
    </div>
  );
};

export default HeroSection;
