import Image from "next/image";

const companies = [
  { name: "Meta", logo: "/assets/images/Meta.png" },
  { name: "Apple", logo: "/assets/images/apple.svg" },
  { name: "Amazon", logo: "/assets/images/amazon.png" },
  { name: "Netflix", logo: "/assets/images/Netflix.png" },
  { name: "Google", logo: "/assets/images/google.png" },
];

export default function CompanyGrid({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (company: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      {companies.map((company) => (
        <div
          key={company.name}
          onClick={() => onSelect(company.name)}
          className={`cursor-pointer p-4 bg-white shadow rounded flex justify-center items-center border-2 ${
            selected === company.name ? "border-blue-600" : "border-transparent"
          }`}
        >
          <Image
            src={company.logo}
            alt={company.name}
            title={company.name}
            width={80}
            height={80}
            className="object-contain max-h-12"
          />
        </div>
      ))}
    </div>
  );
}
