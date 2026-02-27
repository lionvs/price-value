import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-black text-pv-blue mb-4">404</h1>
      <h2 className="text-2xl font-bold text-pv-gray-900 mb-2">
        Page Not Found
      </h2>
      <p className="text-pv-gray-500 mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="inline-block bg-pv-yellow text-pv-gray-900 font-bold px-6 py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
