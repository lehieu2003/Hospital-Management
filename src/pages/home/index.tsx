import Header from './components/header'
import Gallery from './components/gallery'
import homeStyle from './style'
import Hero from './components/hero'
import About from './components/about'
import Stat from './components/stat/stat'
import Services from './components/service/service'
import Appointment from './components/appointment'
import Department from './components/department/department'
import Doctor from './components/doctor/doctor'
import Testimonials from './components/testimonials/testimonials'
import Contact from './components/contact/contact'
import Footer from './components/footer/footer'
import { useBoolean } from 'usehooks-ts'
import { Outlet, useLocation } from 'react-router-dom'
import PatientDetail from '@/pages/home/components/patientdetail';
import { useEffect } from 'react'
import PatientHistory from '@/pages/home/components/patienthistory';
import Chat from './components/chat'

export default function HomePage() {
  const location = useLocation();

  const isPatientDetailPage = location.pathname.includes('/patient-detail');
  const isPatientHistoryPage = location.pathname.includes('/patient-history');

  useEffect(() => {
    if (window.location.hash) {
      const elementId = window.location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div css={homeStyle.container}>
      <Header />
      {isPatientDetailPage ? (
        <PatientDetail />
      ) : isPatientHistoryPage ? (
        <PatientHistory />
      ) : (
        <>
          <Hero />
          <About />
          {/* <Stat /> */}
          <Services />
          <Appointment />
          <Department />
          <Doctor />
          <Testimonials />
          <Gallery />
          <Contact />
        </>
      )}

      <Footer />
      <Chat />
    </div>
  );
}