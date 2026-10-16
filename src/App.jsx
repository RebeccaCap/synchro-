import BackgroundMotifs from "./components/BackgroundMotifs";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
//import Agenda from "./components/Agenda";
//import Countdown from "./components/Countdown";
import NextSession from "./components/NextSession";
//import CTA from "./components/CTA";
import Footer from "./components/Footer";
import CoHosts from "./components/CoHosts";
//import SaveDate from "./components/SaveDate";
import PresentationPage from "./pages/PresentationPage";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/presentation") return <PresentationPage />;

  return (
    <>
      <BackgroundMotifs />
      <Header />
      <main>
        <Hero />
        <About />
        {/* <Agenda /> */}
        <CoHosts />
        {/* <SaveDate /> */}
        <NextSession />
        {/* <CTA /> */}
      </main>
      <Footer />
    </>
  );
}