import "react";
import { useEffect, useRef } from "react";
import SubscribeBox from "../Subscribe/Subscribe";
import Quote from "../Quote/Quote";
import ResumeTemplate from "../ResumeTemp/resumeTemp";
import "./LandingPage.css";
import ScanCV from "../ScanCV/ScanCv";
import Navbar from "../Navbar/Navbar";
import WhyUs from "../WhyUs/WhyUs";

const LandingPage = () => {
  const whyUsRef = useRef(null);

  // useEffect to ensure scrolls correctly when landing page is loaded
  useEffect(() => {
    // If the URL hash is #whyus, scroll to the Why Us section
    if (window.location.hash === "#whyus" && whyUsRef.current) {
      window.scrollTo({
        top: whyUsRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, []); 

  return (
    <div>
      <Navbar />
      <div className="below-nav-content">
        <div>
          <Quote />
          <SubscribeBox />
        </div>
        <div>
          <ResumeTemplate />
        </div>
      </div>
      <div>
        <ScanCV />
      </div>
      <div ref={whyUsRef} id="whyus">
        <WhyUs />
      </div>
    </div>
  );
};

export default LandingPage;
