import { Link } from "react-router-dom";

export interface CardProps {
    backgroundImage: string;
    title: string;
    description: string;
    buttonText: string;
    to: string;
}

export const activities: CardProps[] = [
    {
         
      backgroundImage: "https://spgeng.rosselcdn.net/sites/default/files/dpistyles_v2/sp_16_9_864w/2023/07/27/node_691209/54950328/public/2023/07/27/B9734801023Z.1_20230727092529_000%2BGBJN6SJ8T.1-0.jpeg.jpg?itok=BEvVBEFI1690442736",
      title: "Mari de Josépha",
      description: "Il est à moi",
      buttonText: "Découvrir",
      to: "/"
    },
    {

      backgroundImage: "https://www.francetvinfo.fr/pictures/ZZdUwxSIZmCaeBI_cxPGpl68Dps/1200x1200/2013/06/19/041_MAN364AU.jpg",
      title: "Mari de Lise",
      description: "Il est à elle",
      buttonText: "Découvrir",
      to: "/zombie-hunt"
    },
    {

        backgroundImage: "https://i.ebayimg.com/images/g/MDEAAOSwAwNk-uSP/s-l400.jpg",
        title: "Femme de Gislain",
        description: "Elle est à lui",
        buttonText: "Participer",
        to: "/zombie-hunt"
      },
      {
         
        backgroundImage: "https://img.20mn.fr/dFpOjH9NQquDcVhsXTif0Q/1444x920_natalie-portman-comic-con-san-diego-20-juillet-2019",
        title: "Femme de Jef",
        description: "Elle est à lui",
        buttonText: "Découvrir",
        to: "/"
      },
      {
         
        backgroundImage: "https://img.nrj.fr/l873xvF8ylTa37gR8w83fvlRsMc=/medias%2F2024%2F05%2Fthnxkthh9pnfdlvmuerap6hugbs0qzk9swlmvrylxki_6654960a870a4.png",
        title: "Mari de Camille ",
        description: "Il est à elle",
        buttonText: "Découvrir",
        to: "/"
      },

  ];



export const Card = ({ backgroundImage, title, description, buttonText, to }: CardProps): JSX.Element => {
    return (
        <div className="bg-center bg-no-repeat bg-cover h-[40rem] w-full flex flex-col justify-around"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="h-5 p-4 flex-grow-0">
                <h2 className="inline-block bg-black bg-opacity-70 text-white px-3 py-1 text-sm font-bold rounded">{title}</h2>
            </div>
            <div className="flex-grow flex items-center justify-center pt-28">
                <div className="w-3/4 bg-black bg-opacity-70 p-4 rounded">
                    <p className="text-white text-center">{description}</p>
                </div>
            </div>
            <div className="p-4 flex justify-end">
                <Link to={to} className="transform transition-transform duration-400 hover:scale-110 inline-flex items-center rounded-md bg-red-primary px-3 py-2 font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">{buttonText}</Link>
            </div>
        </div>
    );
};

