// app/components/infocard.tsx

import Link from "next/link";
import { ReactNode } from "react";

export default function InfoCard(
{
	title,
  	description,
  	href,
	imageSrc,
	imageAlt,
	action,
}: 
{
  	title: string;
  	description: string;
  	href: string;
	imageSrc?: string;
	imageAlt?: string;
	action?: ReactNode;
}) 
{
  	const isExternal = href.startsWith("http");

  	const cardClasses =
    	"card bg-white shadow-md border overflow-hidden " +
    	"hover:shadow-lg transition-shadow cursor-pointer block";
	
	const content = (
		<>
			{/* Image (optional) */}
			{imageSrc && (
				<figure className="h-40 w-full overflow-hidden">
					<img
						src={imageSrc}
						alt={imageAlt || title}
						className="w-full h-full object-cover"
					/>
				</figure>
			)}

			{/* Text Content */}
			<div className="p-5">
				<h2 className="text-xl font-bold mb-2">{title}</h2>
				<p className="text-gray-700">{description}</p>
				{ action && 
					<div className="mt-2">{action}</div>
				}
			</div>
		</>
	);

  	return isExternal ? (
    	<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cardClasses}
    	>
		{content}
    	</a>
  	) : (
    	<Link href={href} className={cardClasses}>
			{content}
    	</Link>
  	);
}