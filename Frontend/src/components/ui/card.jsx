export function Card({ className, children }) {
  return (
    <div className={`rounded-lg shadow-md border border-gray-700 bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={className}>{children}</div>;
}
