export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-2 border-t-cyan-400 border-transparent rounded-full animate-[spin_0.8s_ease-in-out_infinite_reverse]"></div>
      </div>
    </div>
  );
}

