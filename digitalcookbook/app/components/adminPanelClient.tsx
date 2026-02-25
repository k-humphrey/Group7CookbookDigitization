//app/components/adminPanelClient.tsx

"use client";

import { useState } from "react";
import InfoCard from "./infocard";

export default function AdminPanelClient({ recipes }: { recipes: any[] }) {
  	const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  	return (
    <>
	<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
		{recipes.map((recipe) => (
			<InfoCard
				key={ recipe._id }
				title={ recipe.title.en }
				description=""
				href="#"
				imageSrc={ recipe.imageURI }
				action={
				<button
					className="btn btn-primary btn-sm"
					onClick={(e) => {
						e.preventDefault();
						setSelectedRecipe(recipe);
					}}
				>
					Edit
				</button>
		}
		/>
		))}
      	</div>

      	{/* Modal */}
      	{selectedRecipe && (
			<dialog
				className="modal modal-open"
				onClick={() => setSelectedRecipe(null)}
			>
				<div
					className="modal-box"
					onClick={(e) => e.stopPropagation()}
				>
					<h3 className="font-bold text-lg mb-4">
						Edit Recipe
					</h3>

				<p className="mb-4">
					Editing: {selectedRecipe.title.en}
				</p>

				{/* Edit form here */}


				<button
					className="btn btn-secondary w-full"
					onClick={() => setSelectedRecipe(null)}
				>
					Close
				</button>
				</div>
			</dialog>
      	)}
    </>
  	);
}