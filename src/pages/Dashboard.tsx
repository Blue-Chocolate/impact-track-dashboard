// pages/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";

type DashboardStats = {
  users: number;
  posts: number;
  todos: number;
};

const Dashboard = () => {
  const { data, isLoading, isError, refetch } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [users, posts, todos] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users").then(res => res.json()),
        fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json()),
        fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json()),
      ]);

      return {
        users: users.length,
        posts: posts.length,
        todos: todos.length,
      };
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (isError)
    return (
      <div className="p-6">
        Error loading data.{" "}
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Users" value={data.users} icon="👥" color="blue" />
        <StatCard label="Impact Entries" value={data.posts} icon="📖" color="green" />
        <StatCard label="Tasks/Outcomes" value={data.todos} icon="✅" color="yellow" />
      </div>
    </div>
  );
};

const colorClasses = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
};

type StatCardProps = {
  label: string;
  value: number;
  icon: string;
  color: keyof typeof colorClasses;
};

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
    <div className={`p-3 rounded-lg ${colorClasses[color].bg}`}>
      <span className={`${colorClasses[color].text} text-2xl`}>{icon}</span>
    </div>
    <div className="ml-4">
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;