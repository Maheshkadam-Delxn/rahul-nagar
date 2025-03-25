/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com"], // ✅ Allow Cloudinary images
    },
  };
  
  export default nextConfig;
  
  