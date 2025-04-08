/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '50mb' // Adjust this value as needed (max recommended: 10mb)
    }
  },
    images: {
      domains: ["res.cloudinary.com","example.com"], // ✅ Allow Cloudinary images
    },
  };
  
  export default nextConfig;
  
  