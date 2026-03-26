//app/shelf-life-guidelines/page.tsx
"use client"
import React, { useState } from "react";
//import { Lang } from "../components/languageprovider";

type ShelfItem = {
	product: string;
	refrigerated: string;
	frozen: string;
};

const dairyAndEggs: ShelfItem[] = [
	{ product: "Butter", refrigerated: "1–3 Months", frozen: "6–9 Months" },
	{ product: "Buttermilk", refrigerated: "1–2 Weeks", frozen: "3 Months" },
	{ product: "Cheese, hard (parmesan, cheddar)", refrigerated: "Unopened: 6 Months; Opened: 3–4 Weeks", frozen: "6 Months" },
	{ product: "Cheese, parmesan, shredded", refrigerated: "12 Months", frozen: "3–4 Months" },
	{ product: "Cheese, shredded (cheddar, mozzarella)", refrigerated: "1 Month", frozen: "3–4 Months" },
	{ product: "Cheese, processed slices", refrigerated: "3–4 Weeks", frozen: "3–4 Months" },
	{ product: "Cheese, soft (brie, goat, etc.)", refrigerated: "1–2 Weeks", frozen: "6 Months" },
	{ product: "Coffee creamer, liquid", refrigerated: "3 Weeks", frozen: "See package instructions" },
	{ product: "Cottage cheese / ricotta", refrigerated: "Unopened: 2 Weeks; Opened: 1 Week", frozen: "Does not freeze well" },
	{ product: "Cream cheese", refrigerated: "2 Weeks", frozen: "Does not freeze well" },
	{ product: "Whipping cream (ultra-pasteurized)", refrigerated: "Unopened: 1 Month; Opened: 1 Week", frozen: "Do not freeze" },
	{ product: "Whipped cream, sweetened", refrigerated: "1 Day", frozen: "1–2 Months" },
	{ product: "Half and half", refrigerated: "3–4 Days", frozen: "4 Months" },
	{ product: "Heavy cream", refrigerated: "10 Days", frozen: "3–4 Months" },
	{ product: "Light cream", refrigerated: "1 Week", frozen: "3–4 Months (use for cooking)" },
	{ product: "Dips, sour cream based", refrigerated: "2 Weeks", frozen: "Do not freeze" },
	{ product: "Egg substitutes (liquid)", refrigerated: "10 Days", frozen: "Do not freeze" },
	{ product: "Egg substitutes unopened", refrigerated: "10 Days", frozen: "Do not freeze" },
	{ product: "Egg substitutes opened", refrigerated: "3 Days", frozen: "Do not freeze" },
	{ product: "Eggnog (commercial)", refrigerated: "3–5 Days", frozen: "6 Months" },
	{ product: "Eggs in shell", refrigerated: "3–5 Weeks", frozen: "Not recommended" },
	{ product: "Eggs raw whites & yolks", refrigerated: "2–4 Days", frozen: "12 Months" },
	{ product: "Eggs hard boiled", refrigerated: "1 Week", frozen: "Does not freeze well" },
	{ product: "Kefir", refrigerated: "Unopened: 1 Week; Opened: 1–2 Days", frozen: "Do not freeze" },
	{ product: "Margarine", refrigerated: "6 Months", frozen: "12 Months" },
	{ product: "Milk (plain or flavored)", refrigerated: "1 Week", frozen: "3 Months" },
	{ product: "Pudding", refrigerated: "Package use-by date; Opened: 2 Days", frozen: "Do not freeze" },
	{ product: "Sour cream", refrigerated: "7–21 Days; see package", frozen: "Does not freeze well" },
	{ product: "Whipped cream (aerosol)", refrigerated: "3–4 Weeks", frozen: "Do not freeze" },
	{ product: "Whipped topping (aerosol)", refrigerated: "3 Months", frozen: "Do not freeze" },
	{ product: "Whipped topping (tub)", refrigerated: "2 Weeks", frozen: "14 Months" },
	{ product: "Yogurt", refrigerated: "14 Days", frozen: "3 Months" },
];

const meatAndPoultry: ShelfItem[] = [
	{ product: "Bacon", refrigerated: "1 Week", frozen: "6 Months" },
	{ product: "Bacon (once opened)", refrigerated: "1 Week", frozen: "2 Months" },
	{ product: "Corned beef (in pouch/pickling juices)", refrigerated: "5–7 Days", frozen: "9–12 Months" },
	{ product: "Beef, lamb, pork, veal (chops/steak/roast)", refrigerated: "3–5 Days", frozen: "9–12 Months" },
	{ product: "Ground meat or stew meat", refrigerated: "1–2 Days", frozen: "6 Months" },
	{ product: "Ham (canned, keep refrigerated)", refrigerated: "6–9 Months", frozen: "Do not freeze" },
	{ product: "Ham fully cooked whole", refrigerated: "1 Week", frozen: "9 Months" },
	{ product: "Ham fully cooked slices/half", refrigerated: "3–4 Days", frozen: "9 Months" },
	{ product: "Ham cook before eating", refrigerated: "1 Week", frozen: "9 Months" },
	{ product: "Hot dogs sealed", refrigerated: "2 Weeks", frozen: "9 Months" },
	{ product: "Hot dogs after opening", refrigerated: "1 Week", frozen: "1–2 Months" },
	{ product: "Lunch meats, sealed", refrigerated: "2 Weeks", frozen: "1–2 Months" },
	{ product: "Lunch meats, opened", refrigerated: "3–5 Days", frozen: "1–2 Months" },
	{ product: "Sausage, raw", refrigerated: "1–2 Days", frozen: "6 Months" },
	{ product: "Sausage, cooked (kielbasa)", refrigerated: "1 Week", frozen: "9 Months" },
	{ product: "Sausage, dry (pepperoni)", refrigerated: "2–3 Months", frozen: "6 Months" },
	{ product: "Chicken/turkey whole", refrigerated: "1–2 Days", frozen: "12 Months" },
	{ product: "Chicken/turkey parts", refrigerated: "1–2 Days", frozen: "9 Months" },
	{ product: "Duck/goose whole", refrigerated: "1–2 Days", frozen: "6 Months" },
	{ product: "Giblets", refrigerated: "1–2 Days", frozen: "3–4 Months" },
	{ product: "Stuffed pork/chicken", refrigerated: "1–2 Days", frozen: "9 Months" },
	{ product: "Kabobs w/ vegetables", refrigerated: "1–2 Days", frozen: "3–4 Months" },
	{ product: "Chicken nuggets/patties", refrigerated: "1–2 Days", frozen: "1–3 Months" },
	{ product: "Cooked poultry dishes", refrigerated: "3–4 Days", frozen: "4–6 Months" },
	{ product: "Fried chicken", refrigerated: "3–4 Days", frozen: "4 Months" },
	{ product: "Ground turkey/chicken", refrigerated: "1–2 Days", frozen: "9 Months" },
];

const freshFish: ShelfItem[] = [
	{ product: "Lean fish (cod, flounder, etc.)", refrigerated: "4–6 Days", frozen: "6–10 Months" },
	{ product: "Lean fish (pollock, trout, etc.)", refrigerated: "4–6 Days", frozen: "4–8 Months" },
	{ product: "Fatty fish (salmon, tuna, etc.)", refrigerated: "4–6 Days", frozen: "2–3 Months" },
	{ product: "Cooked fish", refrigerated: "3–4 Days", frozen: "1–2 Months" },
	{ product: "Surimi seafood", refrigerated: "See package", frozen: "9 Months" },
];

const shellfish: ShelfItem[] = [
	{ product: "Shrimp, scallops, squid", refrigerated: "1–3 Days", frozen: "6–18 Months" },
	{ product: "Shucked clams/mussels/oysters", refrigerated: "3–10 Days", frozen: "3–4 Months" },
	{ product: "Crab meat (fresh)", refrigerated: "1–3 Days", frozen: "2–4 Months" },
	{ product: "Crab meat (pasteurized)", refrigerated: "Unopened: 10–12 Months; Opened: 3–5 Days", frozen: "4–10 Months" },
	{ product: "Crab legs", refrigerated: "2–4 Days", frozen: "9–12 Months" },
	{ product: "Live shellfish", refrigerated: "1–2 Days", frozen: "2–3 Months" },
	{ product: "Live lobster", refrigerated: "Up to 2 weeks", frozen: "Do not freeze" },
	{ product: "Lobster tails", refrigerated: "1–2 Days", frozen: "2–4 Weeks" },
	{ product: "Fresh clams/mussels/oysters", refrigerated: "5–10 Days", frozen: "Do not freeze" },
	{ product: "Whole lobster", refrigerated: "1–2 Days", frozen: "Do not freeze" },
	{ product: "Cooked shellfish", refrigerated: "3–4 Days", frozen: "1–3 Months" },
];

const smokedFish: ShelfItem[] = [
	{ product: "Herring (wine sauce)", refrigerated: "8–12 Months", frozen: "Do not freeze" },
	{ product: "Hot smoked (air pack)", refrigerated: "14–45 Days", frozen: "9–12 Months" },
	{ product: "Hot smoked (vacuum)", refrigerated: "14–45 Days", frozen: "6 Months–1 Year" },
	{ product: "Cold smoked (air pack)", refrigerated: "14–30 Days", frozen: "9–12 Months" },
	{ product: "Cold smoked (vacuum)", refrigerated: "21–30 Days", frozen: "9–12 Months" },
];

const vegetarianProteins: ShelfItem[] = [
	{ product: "Tofu", refrigerated: "1 Week (opened: 2–3 days)", frozen: "6 Months" },
	{ product: "Textured soy protein (TSP)", refrigerated: "Opened: 3–4 Months", frozen: "6 Months" },
];


const Table = ({
	title,
	data,
	color,
	search,
}: {
	title: string;
	data: ShelfItem[];
	color: string;
	search: string;
}) => {
	const filteredData = data.filter((item) =>
		item.product.toLowerCase().includes(search.toLowerCase())
	);

	if (filteredData.length === 0) return null;

	return (
		<div style={{ marginBottom: "40px" }}>
			<h2
				style={{
					textAlign: "center",
					fontWeight: "bold",
					fontSize: "1rem",
					marginTop: "10px",
					marginBottom: "5px",
					backgroundColor: color,
					color: "white",
					padding: "8px",
					borderRadius: "4px",
				}}
			>
				{title}
			</h2>

			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr>
						<th style={th}>Product</th>
						<th style={th}>Refrigerated</th>
						<th style={th}>Frozen</th>
					</tr>
				</thead>
				<tbody>
					{filteredData.map((item, index) => (
						<tr
							key={index}
							style={{
								backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
							}}
						>
							<td style={td}>{item.product}</td>
							<td style={td}>{item.refrigerated}</td>
							<td style={td}>{item.frozen}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const th: React.CSSProperties = {
	border: "1px solid #ccc",
	padding: "8px",
	background: "#f4f4f4",
	textAlign: "left",
};   

const td: React.CSSProperties = {
	border: "1px solid #ccc",
	padding: "8px",
};  

export default function ShelfLifeGuidelinesPage() {
	const [search, setSearch] = useState("");

	return (
		<div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
			<section className="p-8 text-center">
				<h1 className="text-3xl font-bold">Shelf-Life Guidelines</h1>
				<p className="mt-2">
					These are general guidelines based on best quality conditions.
				</p>
			</section>

			{/* 🔍 Search */}
			<div style={{ marginBottom: "20px" }}>
				<input
					type="text"
					placeholder="Search (e.g. chicken, milk, fish...)"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{
						width: "100%",
						padding: "10px",
						border: "1px solid #ccc",
						borderRadius: "6px",
					}}
				/>
			</div>

			<Table
				title="Dairy Products and Eggs"
				data={dairyAndEggs}
				color="#2563eb"
				search={search}
			/>

			<Table
				title="Meat and Poultry"
				data={meatAndPoultry}
				color="#dc2626"
				search={search}
			/>

			<Table
				title="Fresh Fish"
				data={freshFish}
				color="#0891b2"
				search={search}
			/>

			<Table
				title="Shellfish"
				data={shellfish}
				color="#db2777"
				search={search}
			/>

			<Table
				title="Smoked Fish"
				data={smokedFish}
				color="#ea580c"
				search={search}
			/>

			<Table
				title="Vegetarian Proteins"
				data={vegetarianProteins}
				color="#16a34a"
				search={search}
			/>
		</div>
	);
}