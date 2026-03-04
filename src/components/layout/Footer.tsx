import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-sm text-pv-blue mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm text-pv-gray-500">
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Contact Us</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Order Status</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Returns & Exchanges</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Shipping Info</span></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold text-sm text-pv-blue mb-3">About Price Value</h3>
            <ul className="space-y-2 text-sm text-pv-gray-500">
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">About Us</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Careers</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Corporate Info</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Sustainability</span></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-sm text-pv-blue mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-pv-gray-500">
              <li><Link href="/category/computers-laptops" className="hover:text-pv-gray-900 transition-colors">Computers</Link></li>
              <li><Link href="/category/cell-phones" className="hover:text-pv-gray-900 transition-colors">Cell Phones</Link></li>
              <li><Link href="/category/tvs-home-theater" className="hover:text-pv-gray-900 transition-colors">TVs</Link></li>
              <li><Link href="/category/gaming" className="hover:text-pv-gray-900 transition-colors">Gaming</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold text-sm text-pv-blue mb-3">Connect</h3>
            <ul className="space-y-2 text-sm text-pv-gray-500">
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Facebook</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Twitter</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">Instagram</span></li>
              <li><span className="hover:text-pv-gray-900 cursor-pointer transition-colors">YouTube</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-pv-gray-500">
          <p>&copy; {new Date().getFullYear()} Price Value. All rights reserved.</p>
          <p className="mt-1">Prices and availability subject to change. Errors will be corrected where discovered.</p>
        </div>
      </div>
    </footer>
  );
}
