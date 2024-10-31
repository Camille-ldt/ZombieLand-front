
import MyImage from '../assets/img/zombie-accueil.webp';
import { RedLink } from '../components/RedLink';
import { Title } from '../components/Title';
import { Carousel } from '../components/Carousel';
import { activities } from '../components/ActivityCard';


const HomePage = () => {


  return (
    <div className='bg-black min-h-screen'>
        <div className="relative">
          <img 
              src={MyImage}
              alt="Visuel principal de la page"
              className="w-full h-[70vh] object-cover sm:h-screen" // Réduit la hauteur de l'image en version mobile
          />
          <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-center px-4 sm:px-0">
            <p className="text-white max-w-xs sm:max-w-md text-lg sm:text-xl font-semibold bg-gray-800/50 rounded-xl p-4 mb-4">
                Préparez-vous à survivre à l'impensable : entrez dans le monde des zombies, où chaque seconde compte !
            </p>
                <RedLink to='' textSize='text-xl'>Réservation</RedLink>
          </div>
        </div>
          <div className='text-center mt-7'>
              <Title>Qui sommes nous ?</Title>
              <p className='text-white pb-14'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt corrupti aut illum architecto fugit eveniet, deserunt quos nisi sit voluptatum nemo veniam adipisci, delectus ullam, inventore tempore vero repudiandae iure!
              </p>
          </div>

                {/* Intégration du Carousel */}
             
      {/* Intégration du Carousel */}
      <div className="">
        <Carousel items={activities} />
      </div>    
      
    </div>
    
   
  );
   
};

export default HomePage;