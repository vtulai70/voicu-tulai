import { Nav } from "@/components/interactive";
import { TwinChat } from "@/components/twin-chat";
import { About, Beyond, Capabilities, Contact, Footer, Hero, Journey, Marquee, Portfolio, Stats } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Marquee />
        <About />
        <Journey />
        <Capabilities />
        <Beyond />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <TwinChat />
    </>
  );
}
