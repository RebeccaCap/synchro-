import BackgroundMotifs from "./components/BackgroundMotifs";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Agenda from "./components/Agenda";
//import CTA from "./components/CTA";
import Footer from "./components/Footer";
import CoHosts from "./components/CoHosts";
import SaveDate from "./components/SaveDate";

export default function App() {
  return (
    <>
      <BackgroundMotifs />
      <Header />
      <main>
        <Hero />
        <About />
        <Agenda />
        <CoHosts />
        <SaveDate />
        {/* <CTA /> */}
      </main>
      <Footer />
    </>
  );
}