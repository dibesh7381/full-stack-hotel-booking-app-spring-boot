import { useHomePageQuery } from "../services/authApi";

export default function Home() {
  const { data, isLoading, isError } = useHomePageQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading home page...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">Failed to load home page</p>
      </div>
    );
  }

  const home = data?.data;

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center border">
        
        <h1 className="text-2xl font-bold text-blue-700">{home?.title}</h1>

        <p className="mt-3 text-gray-600 text-lg leading-relaxed">
          {home?.content}
        </p>

      </div>
    </div>
  );
}


