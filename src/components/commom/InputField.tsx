type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function InputField({ label, ...props }: Props) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-medium">{label}</label>
      <input
        {...props}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
