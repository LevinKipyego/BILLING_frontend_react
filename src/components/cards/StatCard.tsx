interface StatCardProps {
  title: string;
  value: number;
  variant?: "success" | "warning" | "danger";
}

const colors: Record<NonNullable<StatCardProps["variant"]>, string> = {
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
};

export default function StatCard({
  title,
  value,
  variant,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-2xl font-bold ${
          variant ? colors[variant] : ""
        }`}
      >
        {value}
      
      </p>
    </div>
  );
}
