export default function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="border px-3 py-2 rounded-lg w-full" />;
}
