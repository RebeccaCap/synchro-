import BackgroundMotifs from "./components/BackgroundMotifs";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhoWeAre from "./components/WhoWeAre";
import About from "./components/About";
import Format from "./components/Format";
import Themes from "./components/Themes";
//import Agenda from "./components/Agenda";
//import Countdown from "./components/Countdown";
import NextSession from "./components/NextSession";
//import CTA from "./components/CTA";
import Footer from "./components/Footer";
import CoHosts from "./components/CoHosts";
import UpcomingSession from "./components/UpcomingSession";
import { RegistrationProvider } from "./components/RegistrationProvider";
//import SaveDate from "./components/SaveDate";
import PresentationPage from "./pages/PresentationPage";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/presentation") return <PresentationPage />;

  return (
    <RegistrationProvider>
      <BackgroundMotifs />
      <Header />
      <main>
        <Hero />
        <WhoWeAre />
        <About />
        <Format />
        <Themes />
        {/* <Agenda /> */}
        <CoHosts />
        <UpcomingSession />
        {/* <SaveDate /> */}
        <NextSession />
        {/* <CTA /> */}
      </main>
      <Footer />
    </RegistrationProvider>
  );
}