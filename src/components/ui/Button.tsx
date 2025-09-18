// Button.tsx
export default function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 shadow hover:scale-105 
                  ${props.disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
                  ${className}`}
    >
      {children}
    </button>
  );
}
