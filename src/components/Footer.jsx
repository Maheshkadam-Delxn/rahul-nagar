// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";

// const Footer = () => {
//   const [buildings, setBuildings] = useState([]);

//   useEffect(() => {
//     const fetchBuildings = async () => {
//       try {
//         const response = await fetch("/api/building/fetchAll");
//         if (!response.ok) throw new Error("Failed to fetch buildings");
//         const data = await response.json();
//         setBuildings(data);
//       } catch (error) {
//         console.error("Error fetching buildings:", error);
//       }
//     };
//     fetchBuildings();
//   }, []);

//   return (
//     <footer className="bg-[#15181B] text-white py-12">
//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
//         {/* Logo and About Section */}
//         <div className="md:w-1/3">
//           <Image
//             src="/logo2.png"
//             width={200}
//             height={80}
//             alt="logo"
//             className="w-48 h-20 object-contain transition-transform duration-300 hover:scale-105"
//           />
//           <p className="mt-4 text-gray-400">
//             Rahul Construction is famous for their well-planned societies like Rahul Nagar in Pune.
//           </p>
//         </div>

//         {/* Pages Links */}
//         <div className="md:w-1/6">
//           <h3 className="text-lg font-semibold">Pages</h3>
//           <ul className="mt-4 space-y-2 text-gray-400">
//             <li><Link href="/about" className="hover:text-white hover:underline transition duration-300">About Us</Link></li>
//             <li><Link href="/updates" className="hover:text-white hover:underline transition duration-300">Updates</Link></li>
//             <li><Link href="#" className="hover:text-white hover:underline transition duration-300">Redevelopment</Link></li>
//             <li><Link href="/gallery" className="hover:text-white hover:underline transition duration-300">Gallery</Link></li>
//             <li><Link href="/contact" className="hover:text-white hover:underline transition duration-300">Contact</Link></li>
//           </ul>
//         </div>

//         {/* Buildings Section */}
//         <div className="md:w-1/2">
//           <h3 className="text-lg font-semibold">Buildings</h3>
//           <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-400">
//             {buildings.map((building) => (
//               <li key={building._id} className="transition-transform duration-300 hover:translate-x-2">
//                 <Link 
//                   href={`/project/${building._id}`} 
//                   className="hover:text-white hover:underline"
//                 >
//                   {building.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Copyright Section - Vertical */}
//       <div className="max-w-7xl mx-auto px-6 mt-10 border-t border-gray-700 pt-6">
//         <div className="flex  justify-between items-center text-center text-gray-500 text-sm space-y-2">
//           <span>
//             © Copyright <a href="#" className="text-white hover:text-[#DCBE00] transition duration-300">
//               Rahul Nagar CHSC Association Ltd.
//             </a> 2025. All rights reserved.
//           </span>
//           <span className="font-bold">
//             Created By <Link href={"skillnuts.in"} className="text-[#DCBE00] hover:animate-pulse">Skillnuts</Link>
//           </span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Footer = () => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("/api/building/fetchAll");
        if (!response.ok) throw new Error("Failed to fetch buildings");
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    fetchBuildings();
  }, []);

  // Splitting buildings into three columns
  const columns = 3;
  const columnData = Array.from({ length: columns }, (_, colIndex) =>
    buildings.filter((_, index) => index % columns === colIndex)
  );

  return (
    <footer className="bg-[#15181B] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
        
        {/* Logo and About Section */}
        <div className="md:w-1/3">
          <Image
            src="/logo2.png"
            width={200}
            height={80}
            alt="logo"
            className="w-48 h-20 object-contain transition-transform duration-300 hover:scale-105"
          />
          <p className="mt-4 text-gray-400">
            Rahul Construction is famous for their well-planned societies like Rahul Nagar in Pune.
          </p>
        </div>

        {/* Pages Links */}
        <div className="md:w-1/6">
          <h3 className="text-lg font-semibold">Pages</h3>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li><Link href="/about" className="hover:text-white hover:underline transition duration-300">About Us</Link></li>
            <li><Link href="/updates" className="hover:text-white hover:underline transition duration-300">Updates</Link></li>
            <li><Link href="#" className="hover:text-white hover:underline transition duration-300">Redevelopment</Link></li>
            <li><Link href="/gallery" className="hover:text-white hover:underline transition duration-300">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:underline transition duration-300">Contact</Link></li>
          </ul>
        </div>

        {/* Buildings Section (Three-Column Layout) */}
        <div className="md:w-1/2 flex justify-between">
          {columnData.map((column, index) => (
            <div key={index} className="w-1/3">
              <h3 className="text-lg font-semibold">Buildings</h3>
              <ul className="mt-4 space-y-2 text-gray-400">
                {column.map((building) => (
                  <li key={building._id} className="transition-transform duration-300 hover:translate-x-2">
                    <Link 
                      href={`/project/${building._id}`} 
                      className="hover:text-white hover:underline"
                    >
                      {building.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto px-6 mt-10 border-t border-gray-700 pt-6">
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span>
            © Copyright <a href="#" className="text-white hover:text-[#DCBE00] transition duration-300">
              Rahul Nagar CHSC Association Ltd.
            </a> 2025. All rights reserved.
          </span>
          <span className="font-bold">
            Created By <Link href="https://skillnuts.in" className="text-[#DCBE00] hover:animate-pulse">Skillnuts</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
