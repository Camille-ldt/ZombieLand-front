
import MyImage from '../assets/img/zombie-accueil.webp';
import Button from '../components/Button';



const HomePage = () => {
  return (
    
    <div>
        <img 
        src={MyImage}
        alt="Image principale de la page"
        className="w-full h-auto"
        />
        <p>Préparez-vous à survivre l'impensable : entrez dans le monde des zombies, où chaque seconde compte !</p>
        <Button>Réservation</Button>
    </div>
   
  );

};




export default HomePage;
