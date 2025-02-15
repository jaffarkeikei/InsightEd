import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-900">InsightEd</h1>
        <p className="text-gray-600 mt-2">
          AI-Powered Personalized Feedback for Education
        </p>
        <div className="space-y-4 mt-8">
          <Link 
            href="/login" 
            className="block w-full py-2 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="block w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
} 