import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-pv-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        <li>
          <Link href="/" className="hover:text-pv-blue">
            Home
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span className="mx-1">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-pv-blue">
                {item.label}
              </Link>
            ) : (
              <span className="text-pv-gray-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
