export default function MuhleRestaurantLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="h-[400px] bg-gray-200 w-full"></div>

      {/* Content Skeletons */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 w-full mb-2"></div>
            <div className="h-4 bg-gray-200 w-full mb-2"></div>
            <div className="h-4 bg-gray-200 w-5/6 mb-6"></div>

            <div className="h-6 bg-gray-200 w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 w-2/3 mb-1"></div>
            <div className="h-4 bg-gray-200 w-2/3 mb-1"></div>
            <div className="h-4 bg-gray-200 w-2/3 mb-6"></div>

            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 w-32 rounded-md"></div>
              <div className="h-10 bg-gray-200 w-32 rounded-md"></div>
            </div>
          </div>
          <div className="h-[300px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Menu Highlights Skeleton */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 w-1/3 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="h-[200px] bg-gray-200 mb-4 rounded"></div>
                <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 w-full mb-1"></div>
                <div className="h-4 bg-gray-200 w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

