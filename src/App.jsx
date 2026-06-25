import BackgroundMotifs from "./components/BackgroundMotifs";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Highlight from "./components/Highlight";
import Agenda from "./components/Agenda";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <BackgroundMotifs />
      <Header />
      <main>
        <Hero />
        <About />
        <Highlight />
        <Agenda />
        <CTA />
      </main>
      <Footer />
    </>
  );
}