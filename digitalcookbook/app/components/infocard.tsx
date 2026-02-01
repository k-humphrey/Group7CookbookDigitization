// app/components/infocard.tsx

import Link from "next/link";

export default function InfoCard(
{
  title,
  description,
  href,
}: 
{
  title: string;
  description: string;
  href: string;
}) 
{
  const isExternal = href.startsWith("http");

  const cardClasses =
    "card bg-white shadow-md border p-5 w-full max-w-md " +
    "hover:shadow-lg transition-shadow cursor-pointer block";

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </a>
  ) : (
    <Link href={href} className={cardClasses}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </Link>
  );
}