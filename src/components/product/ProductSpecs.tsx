interface ProductSpecsProps {
  specs: Record<string, string>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <h3 className="bg-pv-gray-100 px-4 py-3 font-bold text-sm text-pv-gray-900">
        Specifications
      </h3>
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              className={idx % 2 === 0 ? "bg-white" : "bg-pv-gray-100/50"}
            >
              <td className="px-4 py-2 font-medium text-pv-gray-700 w-1/3">
                {key}
              </td>
              <td className="px-4 py-2 text-pv-gray-900">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
