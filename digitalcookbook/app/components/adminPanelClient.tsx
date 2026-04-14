//app/components/adminPanelClient.tsx

"use client";

import { useState, useEffect } from "react";
import InfoCard from "./infocard";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";

const PAGE_SIZE = 12; // 3 rows x 4 columns

export default function AdminPanelClient({ recipes }: { recipes: any[] }) {
  	const [selectedRecipe, setSelectedRecipe] = useState< any | null >(null);
	const [page, setPage] = useState(0);
	const [oldImagePublicID, setOldImagePublicID] = useState< string | null >(null);
	const [pendingImage, setPendingImage] = useState<{ url: string, public_id: string } | null>(null);
	const [recipeSearch, setRecipeSearch] = useState("");

	// store recipe checkbox information
	const [appliancesList, setAppliancesList] = useState<any[]>([]);
	const [tagsList, setTagsList] = useState<any[]>([]);
	const [allergensList, setAllergensList] = useState<any[]>([]);
	const [ingredientsList, setIngredientsList] = useState<any[]>([]);
	const [ingredientSearch, setIngredientSearch] = useState("");
	const [unitsList, setUnitsList] = useState<{ fromUnit: string, toUnit: string, multiplier: number }[]>([]);

	// calculate pagination info
	const searchedRecipes = recipes.filter(recipe => recipe.title.en.toLowerCase().includes(recipeSearch.toLowerCase()) || recipe.title.es.toLowerCase().includes(recipeSearch.toLowerCase()));
	const totalPages = Math.ceil(searchedRecipes.length / PAGE_SIZE);
	const pageRecipes = searchedRecipes.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

	// fetch appliances, tags, and allergens from database
	useEffect(() => {
		// get appliances
		fetch("/api/appliances/all")
			.then(res => res.json())
			.then(data => setAppliancesList(data));

		// get tags
		fetch("/api/tags/all")
			.then(res => res.json())
			.then(data => setTagsList(data));

		// get allergens
		fetch("/api/allergens/all")
			.then(res => res.json())
			.then(data => setAllergensList(data));

		// get ingredients
		fetch("/api/ingredients")
			.then(res => res.json())
			.then(data => setIngredientsList(data));

		// get units
		fetch("/api/units")
			.then(res => res.json())
			.then(data => setUnitsList(data.uniqueUnits));
		
	}, []);

	const emptyRecipe = {
		title: { en: "", es: "" },
		ingredientPlainText: { en: "", es: "" },
		instructions: { en: "", es: "" },
		imageURI: "",
		public_id: "",
		tags: {},
		espTags: {},
		ingredients: [],
		appliances: [],
		allergens: {},
		espAllergens: {},
	};

	{/* Handles DELETE using api route in edit-recipes  */}
	const handleDeleteRecipe = async (recipe: any) => {
		// confirmation message
		const confirmed = window.confirm(
			`Are you sure you want to delete "${recipe.title?.en || "this recipe"}"?`
		);
		if (!confirmed) return;

		// Delete image
		if(recipe.public_id)
			await uploadImage(undefined, recipe.public_id);

		const res = await fetch("/api/edit-recipes/", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ _id: recipe._id }),
		});

		//error check
		if (!res.ok) {
			const data = await res.json().catch(() => null);
			alert(data?.error || "Failed to delete recipe.");
			return;
		}

		if (selectedRecipe?._id === recipe._id) {
			setSelectedRecipe(null);
		}

		location.reload(); // reload recipe w/o recipe
	};


  	return (
    <>
	<div className="flex justify-between items-center px-6 mt-6 mb-4">
		<h2 className="text-xl font-semibold">Recipes</h2>
		{/* Create recipe button */}
			<button
				className="btn btn-success"
				onClick={() => setSelectedRecipe({ ...emptyRecipe })}
			>
				+ Create New Recipe
			</button>
	</div>

	{/* Search Bar */}
	<div className="w-full max-w-6xl px-6 mb-4">
		<input
			type="text"
			placeholder="Search Recipes..."
			className="input input-bordered w-full"
			value={recipeSearch}
			onChange={(e) => {
				setRecipeSearch(e.target.value);
				setPage(0);
			}}
		/>
	</div>

	<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
		{pageRecipes.map((recipe) => (
			<InfoCard
				key={ recipe._id }
				title={ recipe.title.en }
				description=""
				href="#"
				imageSrc={ recipe.imageURI.trimEnd() }
				action={
					<div className="w-full flex justify-end gap-2 mt-auto">
						<button
							className="btn btn-primary btn-sm"
							onClick={(e) => {
								e.preventDefault();
								setSelectedRecipe({...recipe});
								setOldImagePublicID(recipe.public_id || null);
							}}
						>
							Edit
						</button>

						<button
							className="btn btn-error btn-sm"
							onClick={(e) => {
								e.preventDefault();
								handleDeleteRecipe(recipe);
							}}
						>
							Delete
						</button>
					</div>	
				}
			/>
		))}
      	</div>

		{/* Pagination Buttons */}
		<div className="flex justify-between w-full max-w-6xl px-6 mb-10">
			<button className="btn btn-outline"
				disabled={page === 0}
				onClick={() => setPage(page - 1)}    
			>
				Previous
			</button>

			<div>
				<span>Page </span>
				<input className="border rounded px-2 py-1 w-14 text-center"
					type="number"
					min={1}
					max={totalPages}
					value={page + 1}
					onChange={(e) => {
						let val = parseInt(e.target.value, 10);
						if(!isNaN(val)) {
							if (val < 1)
								val = 1;
							else if (val > totalPages)
								val = totalPages;
							setPage(val - 1);
						}
					}}
				/>
				<span> of {totalPages}</span>
			</div>

			<button className="btn btn-outline"
				disabled={page + 1 >= totalPages}
				onClick={() => setPage(page + 1)}
			>
				Next
			</button>
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
				{selectedRecipe._id ? "Edit Recipe" : "Create Recipe"}
			</h3>

			{/* TOTAL COST */}
			<div className="flex items-center justify-end gap-3 mb-6">
				<span className="font-semibold">Total Cost:</span>
				<div className="badge badge-md badge-neutral text-base px-4 py-3">
					{selectedRecipe.totalCost != null ? `$${Number(selectedRecipe.totalCost).toFixed(2)}` : "N/A"}
				</div>
			</div>

			{/* IMAGE */}
			<label className="font-semibold" htmlFor="imageInput">Upload Image: </label>
			<input id="imageInput" className="file-input file-input-bordered w-full mb-4"
				type="file"
				accept="image/*"
				onChange={async (e) => {
					const file = e.target.files?.[0];
					if(!file)
						return;
					const res = await uploadImage(file);
					if(!res?.url)
						return;

					if(pendingImage?.public_id) {
						await uploadImage(undefined, pendingImage.public_id);
					}

					setPendingImage({ url: res.url, public_id: res.public_id });
				}}
			/>

			{/* image preview */}
			{(pendingImage?.url || selectedRecipe.imageURI) && (
				<div className="mt-2 relative w-full h-40">
					<Image
						src={(pendingImage?.url || selectedRecipe.imageURI)}
						alt="Preview"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
						className="object-contain rounded"
					/>
				</div>
			)}

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

			{/* INSTRUCTIONS EN */}
			<label className="font-semibold">Instructions (English)</label>
			<textarea
			className="textarea textarea-bordered w-full mb-4"
			value={(selectedRecipe.instructions?.en || "").replaceAll("|||", "\n")}
			onChange={(e) =>
				setSelectedRecipe({
				...selectedRecipe,
				instructions: {
					...selectedRecipe.instructions,
					en: e.target.value.replaceAll("\n", "|||"),
				},
				})
			}
			/>

			{/* INSTRUCTIONS ES */}
			<label className="font-semibold">Instructions (Spanish)</label>
			<textarea
			className="textarea textarea-bordered w-full mb-4"
			value={(selectedRecipe.instructions?.es || "").replaceAll("|||", "\n")}
			onChange={(e) =>
				setSelectedRecipe({
				...selectedRecipe,
				instructions: {
					...selectedRecipe.instructions,
					es: e.target.value.replaceAll("\n", "|||"),
				},
				})
			}
			/>

			{/* INGREDIENTS PLAIN TEXT EN */}
			<label className="font-semibold">Ingredients PlainText (English)</label>
			<textarea
			className="textarea textarea-bordered w-full mb-4"
			value={(selectedRecipe.ingredientPlainText?.en || "").replaceAll("|||", "\n")} //remove |||
			onChange={(e) =>
				setSelectedRecipe({
				...selectedRecipe,
				ingredientPlainText: {
					...selectedRecipe.ingredientPlainText,
					en: e.target.value.replaceAll("\n", "|||"), //add back in
				},
				})
			}
			/>

			{/* INGREDIENTS PLAIN TEXT ES */}
			<label className="font-semibold">Ingredients PlainText (Spanish)</label>
			<textarea
			className="textarea textarea-bordered w-full mb-4"
			value={(selectedRecipe.ingredientPlainText?.es || "").replaceAll("|||", "\n")}
			onChange={(e) =>
				setSelectedRecipe({
				...selectedRecipe,
				ingredientPlainText: {
					...selectedRecipe.ingredientPlainText,
					es: e.target.value.replaceAll("\n", "|||"),
				},
				})
			}
			/>

			{/* INGREDIENTS ENGLISH AND SPANISH */}
			<h4 className="font-bold mt-6 mb-2">Ingredients</h4>
			<input 
				type="text"
				placeholder="Search ingredients..."
				className="input input-bordered w-1/2 mb-2"
				value={ingredientSearch}
				onChange={(e) => setIngredientSearch(e.target.value)}
			/>
			<div className="overflow-auto max-h-80">
				{ingredientsList.filter((ingredient) => ingredient.en.toLowerCase().includes(ingredientSearch.toLowerCase()) || ingredient.es.toLowerCase().includes(ingredientSearch.toLowerCase())).map((ingredient) => {
					const isChecked = (selectedRecipe.ingredients || []).some(
						(a: any) => String(a._id || a.ingredient) === String(ingredient._id)
					);
					return (
						<label key={ingredient._id} className="flex gap-2 mb-2">
							<input
								type="checkbox"
								checked={isChecked}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedRecipe({
											...selectedRecipe,
											ingredients: [
												...(selectedRecipe.ingredients || []),
												{ ...ingredient, amount: "", unit: "", multiplier: 1 },
											],
										});
									} else {
										setSelectedRecipe({
											...selectedRecipe,
											ingredients: (selectedRecipe.ingredients || []).filter(
												(a: any) => String(a._id || a.ingredient) !== String(ingredient._id)
											),
										});
									}
								}}
							/>
							<span>{ingredient.en} / {ingredient.es}</span>

							{/* Ingredient amount and unit*/}
							{isChecked && (
								<div className="flex gap-2">
									{/* Amount */}
									<label className="ml-5">Amount: </label>
									<input 
										type="number"
										className="input input-bordered w-20"
										value={
											(selectedRecipe.ingredients || []).find((a: any) => String(a._id || a.ingredient) === String(ingredient._id))?.amount || ""
										}
										onChange={(e) => {
											setSelectedRecipe({ ...selectedRecipe, ingredients: (selectedRecipe.ingredients || []).map((a: any) => 
												String(a._id || a.ingredient) === String(ingredient._id) ? { ...a, amount: e.target.value} : a
											)});
										}}
									/>

									{/* Unit */}
									<label className="ml-5">Unit: </label>
									<select
										className="select select-bordered w-24"
										value={
											(selectedRecipe.ingredients || []).find((a: any) => String(a._id || a.ingredient || a.ingredient?._id) === String(ingredient._id))?.unit || ""
										}
										onChange={(e) => {
											const unitValue = e.target.value;
											const selectedUnit = unitsList.find(unit => unit.fromUnit === unitValue && unit.toUnit === ingredient.baseUnit);
											setSelectedRecipe({ ...selectedRecipe, ingredients: (selectedRecipe.ingredients || []).map((a: any) =>
												String(a._id || a.ingredient || a.ingredient?._id) === String(ingredient._id) ? { ...a, unit: unitValue, multiplier: selectedUnit?.multiplier || 1 } : a 
											)});
										}}
									>
										<option value="">
											Unit
										</option>
										{[...new Set([...unitsList.map(unit => unit.fromUnit), ...unitsList.map(unit => unit.toUnit)])].map((unit) => (
											<option key={unit} value={unit}>
												{unit}
											</option>
										))}
									</select>
								</div>
							)}
						</label>
					);
				})}
			</div>

			{/* TAGS BOTH ENGLISH AND SPANISH */}
			<h4 className="font-bold mt-6 mb-2">Tags</h4>
			{tagsList.map((tag) => {
				const isChecked = selectedRecipe.tags[tag.en];
				return (
					<label key={tag._id} className="flex gap-2 mb-2">
						<input
							type="checkbox"
							checked={isChecked}
							onChange={(e) => {
								setSelectedRecipe({
									...selectedRecipe,
									tags: { ...selectedRecipe.tags, [tag.en]: e.target.checked },
									espTags: { ...selectedRecipe.espTags, [tag.es]: e.target.checked }
								});
							}}
						/>
						<span>{tag.en} / {tag.es}</span>
					</label>
				);
			})}

			{/* ALLERGENS BOTH ENGLISH AND SPANISH */}
			<h4 className="font-bold mt-6 mb-2">Allergens</h4>
			{allergensList.map((allergen) => {
				const isChecked = selectedRecipe.allergens[allergen.en];
				return (
					<label key={allergen._id} className="flex gap-2 mb-2">
						<input
							type="checkbox"
							checked={isChecked}
							onChange={(e) => {
								setSelectedRecipe({
									...selectedRecipe,
									allergens: { ...selectedRecipe.allergens, [allergen.en]: e.target.checked },
									espAllergens: { ...selectedRecipe.espAllergens, [allergen.es]: e.target.checked }
								});
							}}
						/>
						<span>{allergen.en} / {allergen.es}</span>
					</label>
				);
			})}

			{/* APPLIANCES BOTH ENGLISH AND SPANISH */}
			<h4 className="font-bold mt-6 mb-2">Appliances</h4>
			{appliancesList.map((appliance) => {
				const isChecked = (selectedRecipe.appliances || []).some(
					(a: any) => String(a._id) === String(appliance._id)
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
											appliance,
										],
									});
								} else {
									setSelectedRecipe({
										...selectedRecipe,
										appliances: (selectedRecipe.appliances || []).filter(
											(a: any) => String(a._id) !== String(appliance._id)
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
				onClick={async () => {
					if(pendingImage?.public_id) {
						await uploadImage(undefined, pendingImage.public_id)
					}

					setPendingImage(null);
					setSelectedRecipe(null);
					setOldImagePublicID(null);
				}}
				>
				Cancel
				</button>

				<button
					className="btn btn-primary flex-1"
					onClick={async () => {
						const isNew = !selectedRecipe._id;  //check if _id exists, if not uses POST 

						const formatedIngredients = (selectedRecipe.ingredients || []).map((ingredient: any) => {
							const unitInfo = unitsList.find(unit => unit.fromUnit === ingredient.unit && unit.toUnit === ingredient.baseUnit);
							const ingredientCost = ingredient.unit === "each" ? ingredient.price || 0 : (ingredient.costPerUnit || 0) * (Number(ingredient.amount) || 0) * (ingredient.multiplier || unitInfo?.multiplier || 1);

							return {
								ingredient: ingredient._id || ingredient.ingredient,
								_id: ingredient._id || ingredient.ingredient,
								en: ingredient.en,
								es: ingredient.es,
								amount: Number(ingredient.amount) || 0,
								unit: ingredient.unit,
								costPerUnit: ingredient.costPerUnit || 0,
								baseUnit: ingredient.baseUnit || "",
								productLink: ingredient.productLink || "",
								multiplier: ingredient.multiplier || unitInfo?.multiplier || 1,
								price: ingredient.price,
								storeName: ingredient.storeName,
								packageSize: ingredient.packageSize,
								ingredientCost: ingredientCost
							};
						});

						const totalCost = formatedIngredients.reduce((sum: number, ingredient: any) => sum + (ingredient.ingredientCost || 0), 0);

						await fetch("/api/edit-recipes/", {
							method: isNew? "POST" : "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								...selectedRecipe,
								tags: Object.fromEntries(tagsList.map(tag => [tag.en, !!selectedRecipe.tags?.[tag.en]])),
								espTags: Object.fromEntries(tagsList.map(tag => [tag.es, !!selectedRecipe.espTags?.[tag.es]])),
								allergens: Object.fromEntries(allergensList.map(allergen => [allergen.en, !!selectedRecipe.allergens?.[allergen.en]])),
								espAllergens: Object.fromEntries(allergensList.map(allergen => [allergen.es, !!selectedRecipe.espAllergens?.[allergen.es]])),
								ingredients: formatedIngredients,
								public_id: pendingImage?.public_id || selectedRecipe.public_id,
								imageURI: pendingImage?.url || selectedRecipe.imageURI,
								totalCost
							}),
						});

						if (oldImagePublicID && pendingImage?.public_id) {
							await uploadImage(undefined, oldImagePublicID);
						}

						setPendingImage(null);
						setSelectedRecipe(null);
						setOldImagePublicID(null);
						location.reload();     
					}}
				>
					Save
				</button>
			</div>
			</div>
		</dialog>
		)}
    </>
  	);
}