import Link from "next/link";
import { getAllCategories } from "@/lib/categories";
import { getDeals, getTrending } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";

export default function HomePage() {
  const categories = getAllCategories();
  const deals = getDeals();
  const trending = getTrending();

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-pv-blue to-pv-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              Tech for <span className="text-pv-yellow">Everyone</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 mb-8">
              Shop the latest electronics, computers, phones, and more. Great
              deals every day at Price Value.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/category/computers-laptops"
                className="bg-pv-yellow text-pv-gray-900 font-bold px-6 py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
              >
                Shop Computers
              </Link>
              <Link
                href="/category/cell-phones"
                className="bg-white/10 text-white font-bold px-6 py-3 rounded-md border border-white/30 hover:bg-white/20 transition-colors"
              >
                Shop Phones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-pv-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg hover:border-pv-blue transition-all group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-sm text-pv-gray-900 group-hover:text-pv-blue">
                {cat.name}
              </h3>
              <p className="text-xs text-pv-gray-500 mt-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      {deals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-pv-gray-900">
                Today&apos;s Deals
              </h2>
              <p className="text-sm text-pv-gray-500">
                Limited time savings on top products
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-pv-gray-900">
                Top Rated Products
              </h2>
              <p className="text-sm text-pv-gray-500">
                Highest rated by our customers
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-pv-navy rounded-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Free Shipping on Orders Over $35
          </h2>
          <p className="text-blue-200 mb-6">
            Plus, easy returns and price match guarantee on all items
          </p>
          <Link
            href="/category/tvs-home-theater"
            className="inline-block bg-pv-yellow text-pv-gray-900 font-bold px-8 py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
          >
            Shop TVs & Home Theater
          </Link>
        </div>
      </section>
    </div>
  );
}
