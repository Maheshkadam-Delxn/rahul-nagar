/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com","example.com"], // ✅ Allow Cloudinary images
    },
  };
  
  export default nextConfig;
  
  