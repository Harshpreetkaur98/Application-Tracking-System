import { useEffect, useRef } from "react";
import Quote from "../Quote/Quote";
import ResumeTemplate from "../ResumeTemp/resumeTemp";
import "./LandingPage.css";
import ScanCV from "../ScanCV/ScanCv";
import Navbar from "../Navbar/Navbar";
import WhyUs from "../WhyUs/WhyUs";

const LandingPage = () => {
  const whyUsRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === "#whyus" && whyUsRef.current) {
      window.scrollTo({
        top: whyUsRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [window.location.hash]);

  return (
    <div>
      <Navbar />

      <div className="below-nav-content">
        <div>
          <Quote />
        </div>
        <div>
          <ResumeTemplate />
        </div>
      </div>

      <div>
        <ScanCV />
      </div>

      {/* Why Us section with reference for smooth scrolling */}
      <div ref={whyUsRef} id="whyus">
        <WhyUs />
      </div>
    </div>
  );
};

export default LandingPage;
