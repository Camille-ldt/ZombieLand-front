interface ButtonProps {
    children: string
}

const Button = ({children}: ButtonProps) => {
    return (
        <button
            type="button"
            className="transform transition-transform duration-400 hover:scale-110 relative inline-flex items-center rounded-md bg-red-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
            {children}
        </button>
    )
}

export default Button;