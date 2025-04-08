/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  },
    images: {
      domains: ["res.cloudinary.com","example.com"], // ✅ Allow Cloudinary images
    },
  };
  
  export default nextConfig;
  
  