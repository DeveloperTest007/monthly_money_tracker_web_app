import LoadingSpinner from './LoadingSpinner';

export default function PageLoading({ message }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" color="blue" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
