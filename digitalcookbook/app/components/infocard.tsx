// app/components/infocard.tsx

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useId } from "react";

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

	const descriptionId = useId();

  	const cardClasses =
    	"card bg-white shadow-md border overflow-hidden block transition-shadow" +
	   	"hover:shadow-lg focus:outline-none focus-visible:ring-primary focus-visible:ring-3 focus-visible:ring-offset-2 w-full";
	
	const content = (
		<>
			{/* Image (optional) */}
			{imageSrc && imageSrc.startsWith("http") && (
				<figure className="h-40 w-full overflow-hidden relative">
					<Image
						src={imageSrc}
						alt={imageAlt || title}
						className="object-cover"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
					/>
				</figure>
			)}

			{/* Text Content */}
			<div className="p-5">
				<p className="text-xl font-bold mb-2">{title}</p>
				<p id={descriptionId} className="text-gray-700">{description}</p>
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
			aria-label={`${title} (opens in a new tab)`}
			aria-describedby={descriptionId}
    	>
		{content}
    	</a>
  	) : (
    	<Link href={href} className={cardClasses} aria-describedby={descriptionId}>
			{content}
    	</Link>
  	);
}