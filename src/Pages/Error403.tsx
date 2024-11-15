import Image403 from "../assets/img/Zombie403.webp";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { RedLink } from "../components/RedLink";

const Error403 = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="bg-cover bg-no-repeat object-center h-4/5 relative">
        <img src={Image403} alt="Accès refusé : Zombie" className="w-full" />
        <RedLink
          textSize="text-xl"
          to="/"
          position="absolute bottom-1/3 left-1/2 transform -translate-x-1/2"
        >
          Revenir à l'accueil
        </RedLink>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Error403;
