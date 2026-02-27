import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-pv-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-sm mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white cursor-pointer">Order Status</span></li>
              <li><span className="hover:text-white cursor-pointer">Returns & Exchanges</span></li>
              <li><span className="hover:text-white cursor-pointer">Shipping Info</span></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-sm mb-3">About Price Value</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-white cursor-pointer">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer">Careers</span></li>
              <li><span className="hover:text-white cursor-pointer">Corporate Info</span></li>
              <li><span className="hover:text-white cursor-pointer">Sustainability</span></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-sm mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/category/computers-laptops" className="hover:text-white">Computers</Link></li>
              <li><Link href="/category/cell-phones" className="hover:text-white">Cell Phones</Link></li>
              <li><Link href="/category/tvs-home-theater" className="hover:text-white">TVs</Link></li>
              <li><Link href="/category/gaming" className="hover:text-white">Gaming</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-sm mb-3">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-white cursor-pointer">Facebook</span></li>
              <li><span className="hover:text-white cursor-pointer">Twitter</span></li>
              <li><span className="hover:text-white cursor-pointer">Instagram</span></li>
              <li><span className="hover:text-white cursor-pointer">YouTube</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Price Value. All rights reserved.</p>
          <p className="mt-1">Prices and availability subject to change. Errors will be corrected where discovered.</p>
        </div>
      </div>
    </footer>
  );
}
