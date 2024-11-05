import { Title } from "../components/Title";
import { GreenLink } from "../components/GreenLink";
import { Outlet } from "react-router-dom";




export const UsefulInformation = () => {
    return (
        <div className="bg-black min-h-screen p-11">
            <Title>Informations utiles</Title>     
        
        <div className="py-8 flex flex-wrap justify-center items-center gap-4 sm:text-sm md:text-lg lg:text-xl">
            <GreenLink to="/informations/aboutus">
                À propos
            </GreenLink>
            <GreenLink to="/informations/sitemap">
                Plan du site
            </GreenLink>
            <GreenLink to="">
                Mentions légales
            </GreenLink>
            <GreenLink to="">
                CGV
            </GreenLink>
            <GreenLink to="">
                Newsletter 
            </GreenLink>
            <GreenLink to="">
                Glossaire
            </GreenLink>
            <GreenLink to="">
                Support
            </GreenLink> 
        </div> 

        
<div>
    <Outlet />
</div>
        </div>
    );
};