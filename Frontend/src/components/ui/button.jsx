export function Button({ children, className, onClick, variant = "default" }) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium focus:outline-none transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-500 text-white hover:bg-gray-800",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
