import About from "@/components/About";
import Contact from "@/components/Contact";
import Events from "@/components/Events";
import HeroSection from "@/components/HeroSection";
import QuickLinks from "@/components/QuickLinks";
import Stats from "@/components/Stats";


export default function Home() {

  return(
  <>
    <HeroSection/>
    <Events/>
    <About/>
    {/* <QuickLinks/> */}
    <Stats/>
    <Contact/>
  </>
    

  );
}
