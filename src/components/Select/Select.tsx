import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { SelectOptionItem } from "./Select.type";

type SelectProps<T> = {
  label: string;
  items: SelectOptionItem<T>[]; // Liste des options disponibles dans la liste déroulante
  selectedItem: T; // Option actuellement sélectionnée
  onSelectedItem: (item: T) => void; // Fonction de rappel appelée lorsque l'utilisateur sélectionne une option
};

export const Select = <T,>({
  label,
  items,
  selectedItem,
  onSelectedItem,
}: SelectProps<T>) => {
  const [currentSelectedItem, setCurrentSelectedItem] = useState<
    SelectOptionItem<T> | undefined
  >(undefined);

  useEffect(() => {
    setCurrentSelectedItem(items.find((item) => item.value === selectedItem));
  }, [selectedItem]);

  return (
    <div className="block">
      <Listbox
        value={currentSelectedItem}
        onChange={(item) => {
          onSelectedItem(item.value);
        }}
      >
        <Label className="block font-medium text-white text-sm/6">
          {label}
        </Label>
        <div className="relative mt-2">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-grey py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-green-low focus:outline-none focus:ring-2 focus:ring-red-primary sm:text-sm/6">
            <span className="flex items-center">
              <span className="block ml-3 truncate">
                {currentSelectedItem
                  ? currentSelectedItem?.name
                  : "Sélectionnez une option"}
              </span>
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
              <ChevronUpDownIcon
                aria-hidden="true"
                className="w-5 h-5 text-gray-400"
              />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-grey py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
          >
            {items.map((item: SelectOptionItem<T>) => (
              <ListboxOption
                key={item.name}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-white data-[focus]:bg-red-primary data-[focus]:text-white"
              >
                <div className="flex items-center">
                  <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                    {item.name}
                  </span>
                </div>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-primary group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon aria-hidden="true" className="w-5 h-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
