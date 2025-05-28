import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Link from "next/link";

export default function NotFound() {
  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="bg-red-600 text-dark px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Go back to Homepage
        </Link>
      </div>
    </AuthLayout>
  );
}
