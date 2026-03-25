//app/shelf-life-guidelines/page.tsx

import React from "react";
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
];

const Table = ({ title, data } : { title: string; data: ShelfItem[] }) => (
	<div style={{ marginBottom: "40px" }}>
		<h2
			style={{
				textAlign: "center",
				fontWeight: "bold",
				fontSize: "1rem",
				marginTop: "10px",
				marginBottom: "5px",
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
			{data.map((item, index) => (
			<tr key={index}>
				<td style={td}>{item.product}</td>
				<td style={td}>{item.refrigerated}</td>
				<td style={td}>{item.frozen}</td>
			</tr>
			))}
		</tbody>
		</table>
	</div>
);

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
	return (
		<div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
			<section className="p-8">
				<h1 className="text-3xl font-bold text-center">Shelf-Life Guidelines</h1>
			</section>
			<p>
				These are general guidelines based on best quality conditions. Use visual
				judgment such as molding, wilting, discoloration, or damage.
			</p>

			<Table title="Dairy Products and Eggs" data={dairyAndEggs} />
			<Table title="Meat and Poultry" data={meatAndPoultry} />
		</div>
	);
}