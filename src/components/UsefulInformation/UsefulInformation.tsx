import { useState } from "react";
import { GreenLink } from "../GreenLink";
import Select from "../Select/Select";
import { SelectOptionItem } from "../Select/Select.type";
import { UsefulInformationContentItem } from "./UsefulInformation.type";
import AboutUs from "../../Pages/AboutUs";
import SiteMap from "../../Pages/SiteMap";
import LegalNotices from "../../Pages/LegalNotices";
import CGV from "../../Pages/CGV";
import Newletter from "../../Pages/Newsletter";
import Glossary from "../../Pages/Glossary";
import Support from "../../Pages/Support";


export const UsefulInformation = () => {
  const [selectedItem, setSelectedItem] =
    useState<UsefulInformationContentItem>("aboutus");

  // Déclaration des options disponibles pour le Select, sous forme d'un tableau d'objets
  const optionItems: SelectOptionItem<UsefulInformationContentItem>[] = [
    {
      name: "À propos",
      value: "aboutus",
    },
    {
      name: "Plan du site",
      value: "sitemap",
    },
    {
      name: "Mentions légales",
      value: "legal-notices",
    },
    {
      name: "CGV",
      value: "cgv",
    },
    {
      name: "Newsletter",
      value: "newsletter",
    },
    {
      name: "Glossaire",
      value: "glossary",
    },
    {
      name: "Support",
      value: "support",
    },
  ];

  return (
    <div className="block min-h-screen bg-black p-11">
      <div className="flex-wrap items-center justify-center hidden gap-4 py-8 lg:flex sm:text-sm lg:text-lg xl:text-xl">*
        {/* A voir pour utiliser un MAP pour afficher tout les GreenLink ci-dessous */}
        <GreenLink
          onClick={() => setSelectedItem("aboutus")}
          textSize="text-sm"
          position="relative"
        >
          À propos
        </GreenLink>
        <GreenLink
          onClick={() => setSelectedItem("sitemap")}
          textSize="text-sm"
          position="relative"
        >
          Plan du site
        </GreenLink>
        <GreenLink
          onClick={() => setSelectedItem("legal-notices")}
          textSize="text-sm"
          position="relative"
        >
          Mentions légales
        </GreenLink>
        <GreenLink
          onClick={() => setSelectedItem("cgv")}
          textSize="text-sm"
          position="relative"
        >
          CGV
        </GreenLink>
        <GreenLink
          onClick={() => setSelectedItem("newsletter")}
          textSize="text-sm"
          position="relative"
        >
          Newsletter
        </GreenLink>
        <GreenLink
          onClick={() => setSelectedItem("glossary")}
          textSize="text-sm"
          position="relative"
        >
          Glossaire
        </GreenLink>
        <GreenLink
          onClick={() => setSelectedItem("support")}
          textSize="text-sm"
          position="relative"
        >
          Support
        </GreenLink>
      </div>

      <div>
        <div className="block lg:hidden">
          <Select
            label="Sélectionne ton choix"
            items={optionItems}
            selectedItem={selectedItem}
            onSelectedItem={(nextSelectedItem: UsefulInformationContentItem) =>
              setSelectedItem(nextSelectedItem)
            }
          />
        </div>

        {/* Affichage d'une page lors du click sur un Item */}
        {selectedItem === "aboutus" ? <AboutUs /> : null}

        {selectedItem === "sitemap" ? <SiteMap /> : null}

        {selectedItem === "legal-notices" ? <LegalNotices /> : null}

        {selectedItem === "cgv" ? <CGV /> : null}

        {selectedItem === "newsletter" ? <Newletter /> : null}

        {selectedItem === "glossary" ? <Glossary /> : null}

        {selectedItem === "support" ? <Support /> : null}

        
      </div>
    </div>
  );
};
