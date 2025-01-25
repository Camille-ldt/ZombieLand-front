const AboutUs = () => {
	return (
	  <div className="relative text-left rounded-md lg:mx-52 lg:p-7 mt-7">
	
		<div className="absolute inset-0 bg-[url('./assets/img/zombie-girl.webp')] bg-cover bg-center rounded-md lg:block hidden" 
			 role="img"
			 aria-label="Image d'une fille zombie représentant l'univers immersif de Zombieland"
		/>
  
		<div className="relative rounded-md bg-grey/70 p-7">
		  <h2 className="text-white pb-3.5 sm:text-lg md:text-xl lg:text-3xl font-semibold text-center">
			Bienvenue à ZombieLand, l'expérience d'aventure ultime !
		  </h2>
		  <p className="text-white pb-12 sm:text-base md:text-lg lg:text-xl text-center lg:text-start">
			ZombieLand n'est pas un parc d'attractions comme les autres. Ici, dès
			que vous franchissez les portes, vous entrez dans un monde totalement
			immersif où le frisson et l'adrénaline sont au rendez-vous. Plongé
			dans un décor apocalyptique, chaque visiteur devient le héros de sa
			propre aventure dans une terre infestée de zombies !
		  </p>
		  <h2 className="text-white pb-3.5 sm:text-lg md:text-xl lg:text-3xl font-semibold text-center">
			Notre concept : survivre à l'invasion !
		  </h2>
		  <p className="text-white pb-12 sm:text-base md:text-lg lg:text-xl text-center lg:text-start">
			ZombieLand est conçu pour vous faire vivre une aventure palpitante et
			intense, avec des scénarios variés et des défis à chaque recoin. De
			nos labyrinthes hantés à nos parcours d’obstacles périlleux, en
			passant par nos expériences interactives en réalité virtuelle, chaque
			attraction mettra votre courage et votre agilité à l'épreuve. Que vous
			soyez seul, en groupe ou en famille, notre parc propose une multitude
			d'activités adaptées à tous les niveaux, garantissant une expérience
			unique et mémorable.
		  </p>
		  <h2 className="text-white pb-3.5 sm:text-lg md:text-xl lg:text-3xl font-semibold text-center">
			Une expérience immersive et sécurisée
		  </h2>
		  <p className="text-white pb-12 sm:text-base md:text-lg lg:text-xl text-center lg:text-start">
			Nos acteurs professionnels, costumes et décors soignés créent une
			ambiance terrifiante mais sûre. Toutes nos attractions respectent les
			plus hauts standards de sécurité pour que vous puissiez profiter de
			l'aventure en toute tranquillité, même dans les situations les plus
			terrifiantes !
		  </p>
		  <h2 className="text-white pb-3.5 sm:text-lg md:text-xl lg:text-3xl font-semibold text-center">
			Prêt à survivre ?
		  </h2>
		  <p className="text-white sm:text-base md:text-lg lg:text-xl text-center lg:text-start">
			Rejoignez-nous et découvrez si vous avez l'âme d'un survivant ! Que
			vous veniez pour un anniversaire, un événement spécial ou simplement
			pour repousser vos limites, ZombieLand vous promet des souvenirs
			inoubliables et des sensations fortes comme jamais.
		  </p>
		</div>
	  </div>
	);
  };
  
  export default AboutUs;
  