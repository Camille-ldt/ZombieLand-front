interface ButtonProps {
    children: string
}

// Bouton barre de nav
export const Button = ({children}: ButtonProps) => {
    return (
        <button
            type="button"
            className="transform transition-transform duration-400 hover:scale-110 relative inline-flex items-center rounded-md bg-red-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
            {children}
        </button>
    )
}

// Bouton réservation sur l'image
export const ButtonContent = ({children}: ButtonProps) => {
    return (
        <button
            type="button"
            className="transform transition-transform duration-400 hover:scale-110 relative inline-flex items-center rounded-md bg-red-primary px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
            {children}
        </button>
    )
}

// Encadré titre kaki 
export const ButtonTitle = ({children}: ButtonProps) => {
    return (
        <button
            type="button"
            className="relative inline-flex items-center rounded-md bg-green-low px-3 py-2 text-xl font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-7"
            >
                {children}
            </button>

    )}