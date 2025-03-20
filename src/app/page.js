import Image from "next/image";
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Services from "./components/Services";
import Stats from "./components/Stats";
import CaseStudy from "./components/CaseStudy";
import OurSkills from "./components/OurSkills";
import People from "./components/People";
import Contact from "./components/Contact";
import Testimonial from "./components/Testimonial";
import Blog from "./components/Blog";
import Button from "./components/Button";
import Clients from "./components/Clients";
import Footer from "./components/Footer";

export default function Home() {

  return(
    <>
    <Button name='login' redirect='/login'/>
    <HeroSection/>
    <About/>
    <Services/>
    <Stats/>
    <CaseStudy/>
    <OurSkills/>
    <People/>
    <Contact/>
    <Testimonial/>
    <Blog/>
    <Clients/>
    <Footer/>
    </>
    

  );
}
