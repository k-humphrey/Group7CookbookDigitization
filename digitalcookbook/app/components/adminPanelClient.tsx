//app/components/adminPanelClient.tsx

"use client";

import { useState } from "react";
import InfoCard from "./infocard";

export default function AdminPanelClient({ recipes }: { recipes: any[] }) {
  	const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
	const [newAllergenEn, setNewAllergenEn] = useState("");
	const [newAllergenEs, setNewAllergenEs] = useState("");
	const emptyRecipe = {
		title: { en: "", es: "" },
		ingredientPlainText: { en: "", es: "" },
		instructions: { en: "", es: "" },
		imageURI: "",
		tags: {},
		ingredients: [],
		appliances: [],
		allergens: {},
	};

  	return (
    <>
	<div className="flex justify-between items-center px-6 mb-4">
		<h2 className="text-xl font-semibold">
			Recipes
		</h2>

			<button
				className="btn btn-success"
				onClick={() => setSelectedRecipe({ ...emptyRecipe })}
			>
				+ Create New Recipe
			</button>
	</div>
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
				className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
			<h3 className="font-bold text-2xl mb-6">
				Edit Recipe
			</h3>

			{/* IMAGE */}
			<label className="font-semibold">Image URL</label>
			<input
				className="input input-bordered w-full mb-4"
				value={selectedRecipe.imageURI || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
					imageURI: e.target.value,
					})
				}
			/>

			{/* TITLE EN */}
			<label className="font-semibold">Title (English)</label>
			<input
				className="input input-bordered w-full mb-4"
				value={selectedRecipe.title?.en || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
						title: {
						...selectedRecipe.title,
						en: e.target.value,
						},
					})
				}
			/>

			{/* TITLE ES */}
			<label className="font-semibold">Title (Spanish)</label>
			<input
				className="input input-bordered w-full mb-4"
				value={selectedRecipe.title?.es || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
						title: {
						...selectedRecipe.title,
						es: e.target.value,
						},
					})
				}
			/>

			{/* INGREDIENTS PLAIN TEXT EN */}
			<label className="font-semibold">
				Ingredients (English)
			</label>
			<textarea
				className="textarea textarea-bordered w-full mb-4"
				value={selectedRecipe.ingredientPlainText?.en || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
						ingredientPlainText: {
						...selectedRecipe.ingredientPlainText,
						en: e.target.value,
						},
					})
				}
			/>

			{/* INGREDIENTS PLAIN TEXT ES */}
			<label className="font-semibold">
				Ingredients (Spanish)
			</label>
			<textarea
				className="textarea textarea-bordered w-full mb-4"
				value={selectedRecipe.ingredientPlainText?.es || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
						ingredientPlainText: {
						...selectedRecipe.ingredientPlainText,
						es: e.target.value,
						},
					})
				}
			/>

			{/* INSTRUCTIONS EN */}
			<label className="font-semibold">
				Instructions (English)
			</label>
			<textarea
				className="textarea textarea-bordered w-full mb-4"
				value={selectedRecipe.instructions?.en || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
						instructions: {
						...selectedRecipe.instructions,
						en: e.target.value,
						},
					})
				}
			/>

			{/* INSTRUCTIONS ES */}
			<label className="font-semibold">
				Instructions (Spanish)
			</label>
			<textarea
				className="textarea textarea-bordered w-full mb-4"
				value={selectedRecipe.instructions?.es || ""}
				onChange={(e) =>
					setSelectedRecipe({
						...selectedRecipe,
						instructions: {
						...selectedRecipe.instructions,
						es: e.target.value,
						},
					})
				}
			/>

			{/* TAGS EN */}
			<h4 className="font-bold mt-6 mb-2">Tags (English)</h4>
			{Object.keys(selectedRecipe.tags || {}).map((tag) => (
				<label key={tag} className="flex gap-2 mb-2">
				<input
					type="checkbox"
					checked={selectedRecipe.tags[tag]}
					onChange={(e) =>
						setSelectedRecipe({
							...selectedRecipe,
							tags: {
							...selectedRecipe.tags,
							[tag]: e.target.checked,
							},
						})
					}
				/>
				{tag}
				</label>
			))}

			{/* TAGS BUT ES */}
			<h4 className="font-bold mt-6 mb-2">Tags (Spanish)</h4>
			{Object.keys(selectedRecipe.espTags || {}).map((tag) => (
				<label key={tag} className="flex gap-2 mb-2">
				<input
					type="checkbox"
					checked={selectedRecipe.espTags[tag]}
					onChange={(e) =>
						setSelectedRecipe({
							...selectedRecipe,
							espTags: {
							...selectedRecipe.espTags,
							[tag]: e.target.checked,
							},
						})
					}
				/>
				{tag}
				</label>
			))}

			{/* ALLERGENS EN */}
			<h4 className="font-bold mt-6 mb-2">Allergens (English)</h4>
			{Object.keys(selectedRecipe.allergens || {}).map(
				(allergen) => (
				<label key={allergen} className="flex gap-2 mb-2">
					<input
					type="checkbox"
					checked={
						selectedRecipe.allergens[allergen]
					}
					onChange={(e) =>
						setSelectedRecipe({
						...selectedRecipe,
						allergens: {
							...selectedRecipe.allergens,
							[allergen]: e.target.checked,
						},
					})
					}
					/>
					{allergen}
				</label>
				)
			)}
			<div className="flex gap-2 mt-2">
			<input
				className="input input-bordered input-sm flex-1"
				placeholder="New allergen..."
				value={newAllergenEn}
				onChange={(e) => setNewAllergenEn(e.target.value)}
			/>
				<button
					className="btn btn-sm btn-outline"
					onClick={() => {
						if (!newAllergenEn.trim()) return;
						setSelectedRecipe({
							...selectedRecipe,
							allergens: {
								...selectedRecipe.allergens,
								[newAllergenEn.trim()]: true,
							},
						});
						setNewAllergenEn("");
					}}
				>
					Add
				</button>
			</div>

			{/* ALLERGENS ES */}
			<h4 className="font-bold mt-6 mb-2">Allergens (Spanish)</h4>
			{Object.keys(selectedRecipe.espAllergens || {}).map((allergen) => (
				<label key={allergen} className="flex gap-2 mb-2">
					<input
						type="checkbox"
						checked={selectedRecipe.espAllergens[allergen]}
						onChange={(e) =>
							setSelectedRecipe({
								...selectedRecipe,
								espAllergens: {
									...selectedRecipe.espAllergens,
									[allergen]: e.target.checked,
								},
							})
						}
					/>
					{allergen}
				</label>
			))}
			<div className="flex gap-2 mt-2">
				<input
					className="input input-bordered input-sm flex-1"
					placeholder="Nuevo alérgeno..."
					value={newAllergenEs}
					onChange={(e) => setNewAllergenEs(e.target.value)}
				/>
				<button
					className="btn btn-sm btn-outline"
					onClick={() => {
						if (!newAllergenEs.trim()) return;
						setSelectedRecipe({
							...selectedRecipe,
							espAllergens: {
								...selectedRecipe.espAllergens,
								[newAllergenEs.trim()]: true,
							},
						});
						setNewAllergenEs("");
					}}
				>
					Add
				</button>
			</div>

			{/* APPLIANCES BOTH ENGLISH AND SPANISH */}
			<h4 className="font-bold mt-6 mb-2">Appliances</h4>
			{[
				{ _id: "695ec4c6b0379ee832d8a867", en: "Microwave", es: "Microondas" },
				{ _id: "695ec4c6b0379ee832d8a866", en: "Oven", es: "Horno" },
				{ _id: "695ec4c6b0379ee832d8a86a", en: "Skillet/Frying Pan", es: "Sartén/Sartén" },
				{ _id: "695ec4c6b0379ee832d8a869", en: "Stockpot/Dutch Oven", es: "olla/horno holandés" },
				{ _id: "695ec4c6b0379ee832d8a86b", en: "Saucepan with Lid", es: "Cacerola con Tapa" },
				{ _id: "695ec4c6b0379ee832d8a868", en: "Slow Cooker", es: "Olla de Cocción Lenta" },
				{ _id: "695ec4c6b0379ee832d8a86c", en: "Stockpot and Skillet", es: "Olla y Sartén" },
			].map((appliance) => {
				const isChecked = (selectedRecipe.appliances || []).some(
					(a: any) => String(a.appliance) === String(appliance._id)
				);
				return (
					<label key={appliance._id} className="flex gap-2 mb-2">
						<input
							type="checkbox"
							checked={isChecked}
							onChange={(e) => {
								if (e.target.checked) {
									setSelectedRecipe({
										...selectedRecipe,
										appliances: [
											...(selectedRecipe.appliances || []),
											{ appliance: appliance._id, en: appliance.en, es: appliance.es },
										],
									});
								} else {
									setSelectedRecipe({
										...selectedRecipe,
										appliances: (selectedRecipe.appliances || []).filter(
											(a: any) => String(a.appliance) !== String(appliance._id)
										),
									});
								}
							}}
						/>
						<span>{appliance.en} / {appliance.es}</span>
					</label>
				);
			})}

			{/* SAVE BUTTONS */}
			<div className="flex gap-4 mt-8">
				<button
					className="btn btn-secondary flex-1"
				onClick={() => setSelectedRecipe(null)}
				>
				Cancel
				</button>

				<button
					className="btn btn-primary flex-1"
					onClick={async () => {
						await fetch(
						`/api/edit-recipes/`,
							{
								method: "PUT",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(selectedRecipe),
							}
						);

					setSelectedRecipe(null);
					location.reload();
					}}
				>
				Save Changes
				</button>
			</div>
			</div>
		</dialog>
		)}
    </>
  	);
}