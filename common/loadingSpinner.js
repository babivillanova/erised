export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-red-200 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-red-600 border-r-green-600 border-b-red-600 border-l-green-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

