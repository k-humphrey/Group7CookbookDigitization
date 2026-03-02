//app/admin-panel/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

"use client";

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { cookies } from "next/headers";
import AdminPanelClient from "../components/adminPanelClient";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../admin-login/page";
import { useState } from "react";

export default async function AdminPanelPage() {
	//get cookies
	const cookieStore = await cookies(); 

	//Variable to keep track of which value from the dropdown is selected
	const [selected, setSelected] = useState("");

	//check authentication
	if (!isAdminAuthenticated(cookieStore)) {
			//return login page back
			return <AdminLoginPage />
	}

	//if authenticated connect to db
	await connectToDB();
	//get all recipes
	const recipes = await Recipe.find().lean();
	const safeRecipes = JSON.parse(JSON.stringify(recipes));
	//return the recipe view
  return (
	<main>
		<div className="p-6 max-w-md">
		{/* Dropdown */}
		<select
		value={selected}
		onChange={(e) => setSelected(e.target.value)}
		className="border p-2 rounded w-full"
		>
		<option value="">Select an option</option>
		<option value="editResources">Edit Community Resources</option>
		<option value="addResources">Add Community Resources</option>

		<option value="editPartners">Edit Community Partners</option>
		<option value="addPartners">Add Community Partners</option>

		<option value="editAds">Edit Advertisements</option>
		<option value="addAds">Add Advertisements</option>

		<option value="editRecipes">Edit Recipes</option>
		<option value="addRecipes">Add Recipes</option>

		</select>

		{/* Edit/Add info cards that are shown */}
		{selected === "editResources" && (
		<div className="mt-4 p-4 bg-blue-100 rounded shadow">
			<h2 className="text-lg font-bold">Edit Community Resources</h2>
		</div>
		)}

		{selected === "addResources" && (
		<div className="mt-4 p-4 bg-blue-100 rounded shadow">
			<h2 className="text-lg font-bold">Add Community Resources</h2>
			<label className="form-label">English Title</label>
			<input className="form-control" type="text" id="txtResourcesEnglishTitle"></input>
			<label className="form-label">Spanish Title</label>
			<input className="form-control" type="text" id="txtResourcesSpanishTitle"></input>

			<label className="form-label">English Description</label>
			<input className="form-control" type="text" id="txtResourcesEnglishDescription"></input>
			<label className="form-label">Spanish Description</label>
			<input className="form-control" type="text" id="txtResourcesEnglishDescription"></input>
			
			<label className="form-label">Link (leave blank if there doesn't need to be one)</label>
			<input className="form-control" type="text" id="txtLink"></input>
		</div>
		)}

		{selected === "editPartners" && (
		<div className="mt-4 p-4 bg-blue-100 rounded shadow">
			<h2 className="text-lg font-bold">Edit Community Partners</h2>
		</div>
		)}

		{selected === "addPartners" && (
		<div className="mt-4 p-4 bg-blue-100 rounded shadow">
			<h2 className="text-lg font-bold">Add Community Partners</h2>
			<label className="form-label">Name of Partner</label>
			<input className="form-control" type="text" id="txtPartnersEnglishTitle"></input>

			<label className="form-label">English Description</label>
			<input className="form-control" type="text" id="txtPartnerEnglishDescription"></input>
			<label className="form-label">Spanish Description</label>
			<input className="form-control" type="text" id="txtPartnerEnglishDescription"></input>
			
			<label className="form-label">Link (leave blank if there doesn't need to be one)</label>
			<input className="form-control" type="text" id="txtLink"></input>
		</div>
		)}
		
		{selected === "editAds" && (
		<div className="mt-4 p-4 bg-blue-100 rounded shadow">
			<h2 className="text-lg font-bold">Edit Community Resources</h2>
			<p>This card appears when "Show Info" is selected.</p>
		</div>
		)}

		{selected === "addAds" && (
		<div className="mt-4 p-4 bg-blue-100 rounded shadow">
			<h2 className="text-lg font-bold">Edit Community Resources</h2>
			<p>This card appears when "Show Info" is selected.</p>
		</div>
		)}

		{selected === "editRecipes" && (<div className="min-h-screen w-full flex flex-col items-center py-12">
		<h1 className="text-2xl font-bold mb-6 ml-6">Admin Panel</h1>
			<div className="w-full max-w-6xl mx-auto">
				<AdminPanelClient recipes={safeRecipes} />
			</div>
		</div>
		)}

		{selected === "addRecipes" && (<div className="min-h-screen w-full flex flex-col items-center py-12">
		<h1 className="text-2xl font-bold mb-6 ml-6">Admin Panel</h1>
			<div className="w-full max-w-6xl mx-auto">
				<AdminPanelClient recipes={safeRecipes} />
			</div>
		</div>
		)}
		
		</div>
	</main>
  );
}