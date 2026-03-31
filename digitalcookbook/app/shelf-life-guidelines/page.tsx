//app/shelf-life-guidelines/page.tsx
"use client"
import React, { useState } from "react";
//import { Lang } from "../components/languageprovider";

type ShelfItem = {
	product: string;
	pantry?: string;
	refrigerated?: string;
	frozen?: string;
	pantryAfterOpening?: string;
};

const dairyAndEggs: ShelfItem[] = [
	{ product: "Butter", refrigerated: "1-3 Months", frozen: "6-9 Months" },
	{ product: "Buttermilk", refrigerated: "1-2 Weeks", frozen: "3 Months" },
	{ product: "Cheese, hard (parmesan, cheddar)", refrigerated: "Unopened: 6 Months; Opened: 3-4 Weeks", frozen: "6 Months" },
	{ product: "Cheese, parmesan, shredded", refrigerated: "12 Months", frozen: "3-4 Months" },
	{ product: "Cheese, shredded (cheddar, mozzarella)", refrigerated: "1 Month", frozen: "3-4 Months" },
	{ product: "Cheese, processed slices", refrigerated: "3-4 Weeks", frozen: "3-4 Months" },
	{ product: "Cheese, soft (brie, goat, etc.)", refrigerated: "1-2 Weeks", frozen: "6 Months" },
	{ product: "Coffee creamer, liquid", refrigerated: "3 Weeks", frozen: "See package instructions" },
	{ product: "Cottage cheese / ricotta", refrigerated: "Unopened: 2 Weeks; Opened: 1 Week", frozen: "Does not freeze well" },
	{ product: "Cream cheese", refrigerated: "2 Weeks", frozen: "Does not freeze well" },
	{ product: "Whipping cream (ultra-pasteurized)", refrigerated: "Unopened: 1 Month; Opened: 1 Week", frozen: "Do not freeze" },
	{ product: "Whipped cream, sweetened", refrigerated: "1 Day", frozen: "1-2 Months" },
	{ product: "Half and half", refrigerated: "3-4 Days", frozen: "4 Months" },
	{ product: "Heavy cream", refrigerated: "10 Days", frozen: "3-4 Months" },
	{ product: "Light cream", refrigerated: "1 Week", frozen: "3-4 Months (use for cooking)" },
	{ product: "Dips, sour cream based", refrigerated: "2 Weeks", frozen: "Do not freeze" },
	{ product: "Egg substitutes (liquid)", refrigerated: "10 Days", frozen: "Do not freeze" },
	{ product: "Egg substitutes unopened", refrigerated: "10 Days", frozen: "Do not freeze" },
	{ product: "Egg substitutes opened", refrigerated: "3 Days", frozen: "Do not freeze" },
	{ product: "Eggnog (commercial)", refrigerated: "3-5 Days", frozen: "6 Months" },
	{ product: "Eggs in shell", refrigerated: "3-5 Weeks", frozen: "Not recommended" },
	{ product: "Eggs raw whites & yolks", refrigerated: "2-4 Days", frozen: "12 Months" },
	{ product: "Eggs hard boiled", refrigerated: "1 Week", frozen: "Does not freeze well" },
	{ product: "Kefir", refrigerated: "Unopened: 1 Week; Opened: 1-2 Days", frozen: "Do not freeze" },
	{ product: "Margarine", refrigerated: "6 Months", frozen: "12 Months" },
	{ product: "Milk (plain or flavored)", refrigerated: "1 Week", frozen: "3 Months" },
	{ product: "Pudding", refrigerated: "Package use-by date; Opened: 2 Days", frozen: "Do not freeze" },
	{ product: "Sour cream", refrigerated: "7-21 Days; see package", frozen: "Does not freeze well" },
	{ product: "Whipped cream (aerosol)", refrigerated: "3-4 Weeks", frozen: "Do not freeze" },
	{ product: "Whipped topping (aerosol)", refrigerated: "3 Months", frozen: "Do not freeze" },
	{ product: "Whipped topping (tub)", refrigerated: "2 Weeks", frozen: "14 Months" },
	{ product: "Yogurt", refrigerated: "14 Days", frozen: "3 Months" },
];

const meatAndPoultry: ShelfItem[] = [
	{ product: "Bacon", refrigerated: "1 Week", frozen: "6 Months" },
	{ product: "Bacon (once opened)", refrigerated: "1 Week", frozen: "2 Months" },
	{ product: "Corned beef (in pouch/pickling juices)", refrigerated: "5-7 Days", frozen: "9-12 Months" },
	{ product: "Beef, lamb, pork, veal (chops/steak/roast)", refrigerated: "3-5 Days", frozen: "9-12 Months" },
	{ product: "Ground meat or stew meat", refrigerated: "1-2 Days", frozen: "6 Months" },
	{ product: "Ham (canned, keep refrigerated)", refrigerated: "6-9 Months", frozen: "Do not freeze" },
	{ product: "Ham fully cooked whole", refrigerated: "1 Week", frozen: "9 Months" },
	{ product: "Ham fully cooked slices/half", refrigerated: "3-4 Days", frozen: "9 Months" },
	{ product: "Ham cook before eating", refrigerated: "1 Week", frozen: "9 Months" },
	{ product: "Hot dogs sealed", refrigerated: "2 Weeks", frozen: "9 Months" },
	{ product: "Hot dogs after opening", refrigerated: "1 Week", frozen: "1-2 Months" },
	{ product: "Lunch meats, sealed", refrigerated: "2 Weeks", frozen: "1-2 Months" },
	{ product: "Lunch meats, opened", refrigerated: "3-5 Days", frozen: "1-2 Months" },
	{ product: "Sausage, raw", refrigerated: "1-2 Days", frozen: "6 Months" },
	{ product: "Sausage, cooked (kielbasa)", refrigerated: "1 Week", frozen: "9 Months" },
	{ product: "Sausage, dry (pepperoni)", refrigerated: "2-3 Months", frozen: "6 Months" },
	{ product: "Chicken/turkey whole", refrigerated: "1-2 Days", frozen: "12 Months" },
	{ product: "Chicken/turkey parts", refrigerated: "1-2 Days", frozen: "9 Months" },
	{ product: "Duck/goose whole", refrigerated: "1-2 Days", frozen: "6 Months" },
	{ product: "Giblets", refrigerated: "1-2 Days", frozen: "3-4 Months" },
	{ product: "Stuffed pork/chicken", refrigerated: "1-2 Days", frozen: "9 Months" },
	{ product: "Kabobs w/ vegetables", refrigerated: "1-2 Days", frozen: "3-4 Months" },
	{ product: "Chicken nuggets/patties", refrigerated: "1-2 Days", frozen: "1-3 Months" },
	{ product: "Cooked poultry dishes", refrigerated: "3-4 Days", frozen: "4-6 Months" },
	{ product: "Fried chicken", refrigerated: "3-4 Days", frozen: "4 Months" },
	{ product: "Ground turkey/chicken", refrigerated: "1-2 Days", frozen: "9 Months" },
];

const freshFish: ShelfItem[] = [
	{ product: "Lean fish (cod, flounder, etc.)", refrigerated: "4-6 Days", frozen: "6-10 Months" },
	{ product: "Lean fish (pollock, trout, etc.)", refrigerated: "4-6 Days", frozen: "4-8 Months" },
	{ product: "Fatty fish (salmon, tuna, etc.)", refrigerated: "4-6 Days", frozen: "2-3 Months" },
	{ product: "Cooked fish", refrigerated: "3-4 Days", frozen: "1-2 Months" },
	{ product: "Surimi seafood", refrigerated: "See package", frozen: "9 Months" },
];

const shellfish: ShelfItem[] = [
	{ product: "Shrimp, scallops, squid", refrigerated: "1-3 Days", frozen: "6-18 Months" },
	{ product: "Shucked clams/mussels/oysters", refrigerated: "3-10 Days", frozen: "3-4 Months" },
	{ product: "Crab meat (fresh)", refrigerated: "1-3 Days", frozen: "2-4 Months" },
	{ product: "Crab meat (pasteurized)", refrigerated: "Unopened: 10-12 Months; Opened: 3-5 Days", frozen: "4-10 Months" },
	{ product: "Crab legs", refrigerated: "2-4 Days", frozen: "9-12 Months" },
	{ product: "Live shellfish", refrigerated: "1-2 Days", frozen: "2-3 Months" },
	{ product: "Live lobster", refrigerated: "Up to 2 weeks", frozen: "Do not freeze" },
	{ product: "Lobster tails", refrigerated: "1-2 Days", frozen: "2-4 Weeks" },
	{ product: "Fresh clams/mussels/oysters", refrigerated: "5-10 Days", frozen: "Do not freeze" },
	{ product: "Whole lobster", refrigerated: "1-2 Days", frozen: "Do not freeze" },
	{ product: "Cooked shellfish", refrigerated: "3-4 Days", frozen: "1-3 Months" },
];

const smokedFish: ShelfItem[] = [
	{ product: "Herring (wine sauce)", refrigerated: "8-12 Months", frozen: "Do not freeze" },
	{ product: "Hot smoked (air pack)", refrigerated: "14-45 Days", frozen: "9-12 Months" },
	{ product: "Hot smoked (vacuum)", refrigerated: "14-45 Days", frozen: "6 Months-1 Year" },
	{ product: "Cold smoked (air pack)", refrigerated: "14-30 Days", frozen: "9-12 Months" },
	{ product: "Cold smoked (vacuum)", refrigerated: "21-30 Days", frozen: "9-12 Months" },
];

const vegetarianProteins: ShelfItem[] = [
	{ product: "Tofu", refrigerated: "1 Week (opened: 2-3 days)", frozen: "6 Months" },
	{ product: "Textured soy protein (TSP)", refrigerated: "Opened: 3-4 Months", frozen: "6 Months" },
];

const deliAndPreparedFoods: ShelfItem[] = [
	{ product: "Cheese, store sliced hard cheese such as cheddar or swiss", refrigerated: "2-4 Weeks", frozen: "6 Months" },
	{ product: "Cheese, soft such as brie, bel paese, goat cheese, fresh mozzarella", refrigerated: "1-2 Weeks", frozen: "6 Months" },
	{ product: "Chicken, rotisserie or fried", refrigerated: "3-4 Days", frozen: "4 Months" },
	{ product: "Commerical brand vacuum packed dinners with USDA seal", refrigerated: "2 Weeks", frozen: "6 Months" },
	{ product: "Cooked pasta", refrigerated: "3-5 days", frozen: "6 Months" },
	{ product: "Cooked rice", refrigerated: "4-6 Days", frozen: "6 Months" },
	{ product: "Fruit, cut", refrigerated: "Package use-by date; Opened: 4 Days", frozen: "Do not freeze" },
	{ product: "Guacamole", refrigerated: "5-7 Days", frozen: "6 Months" },
	{ product: "Hummus, pasteurized", refrigerated: "3 Months", frozen: "Does not freeze well" },
	{ product: "Hummus, with preservates", refrigerated: "2 Months", frozen: "Does not freeze well" },
	{ product: "Hummus, traditional (no preservatives, not pasturized)", refrigerated: "7 Days", frozen: "Does not freeze well" },
	{ product: "Lunch / Deli meats, store-sliced", refrigerated: "3-5 Days", frozen: "1-2 Months" },
	{ product: "Main dishes or meals, hot or refrigerated", refrigerated: "3-4 Days", frozen: "6 Months" },
	{ product: "Meats covered with gravy or broth", refrigerated: "3-4 Days", frozen: "6 Months" },
	{ product: "Olives", refrigerated: "2 Months", frozen: "Do not freeze" },
	{ product: "Paté", refrigerated: "1-2 Days", frozen: "1-2 Months" },
	{ product: "Pudding", refrigerated: "Package use-by date; Opened: 2 Days", frozen: "Do not freeze" },
	{ product: "Salads containing meat, fish, poultry, or eggs", refrigerated: "3-4 Days", frozen: "Do not freeze" },
	{ product: "Salads, vetetable", refrigerated: "3-5 Days", frozen: "Do not freeze" },
	{ product: "Side dishes such as cooked vegetables, rice or potatoes", refrigerated: "3-4 Days", frozen: "6 Months" },
	{ product: "Soup, stews", refrigerated: "3-4 Days", frozen: "6 Months" },
];

const bakeryProducts: ShelfItem[] = [
	{ product: "Commercial bread products (incl pan breads, flatbreads, rolls, buns)", pantry: "14-18 Days", refrigerated: "2-3 Weeks", frozen: "3-5 Months" },
	{ product: "Tortillas", pantry: "3 Months", refrigerated: "3 Months", frozen: "6 Months" },
	{ product: "Commercial cakes and muffins", pantry: "3-7 Days", refrigerated: "7-10 Days", frozen: "6 Months" },
	{ product: "Cheesecake", pantry: "—", refrigerated: "5-7 Days", frozen: "3-6 Months" },
	{ product: "Cookies, soft", pantry: "2-3 Months", refrigerated: "—", frozen: "8-12 Months" },
	{ product: "Cookies, crispy", pantry: "4-6 Months", refrigerated: "—", frozen: "8-12 Months" },
	{ product: "Dairy filled eclairs", pantry: "—", refrigerated: "2-3 Days", frozen: "3 Months" },
	{ product: "Doughnuts", pantry: "1-2 Days", refrigerated: "2 Days", frozen: "3-6 Months" },
	{ product: "Fruit cake", pantry: "6 Months", refrigerated: "12 Months", frozen: "12 Months" },
	{ product: "Pastries, danish", pantry: "5-10 Days", refrigerated: "14 Days", frozen: "3-6 Months" },
	{ product: "Pies, chiffon", pantry: "—", refrigerated: "1-2 Days", frozen: "3-6 Months" },
	{ product: "Pies, cream", pantry: "—", refrigerated: "3-4 Days", frozen: "3-6 Months" },
	{ product: "Pies, fruit", pantry: "1-2 Days", refrigerated: "1 Week", frozen: "8 Months" },
	{ product: "Pies, mincemeat", pantry: "2 Hours", refrigerated: "1 Week", frozen: "8 Months" },
	{ product: "Pies, pecan", pantry: "2 Hours", refrigerated: "3-4 Days", frozen: "3-6 Months" },
	{ product: "Pies, pumpkin", pantry: "2 Hours", refrigerated: "3-4 Days", frozen: "3-6 Months" },
	{ product: "Quiche", pantry: "2 Hours", refrigerated: "3-5 Days", frozen: "3-6 Months" },
];

const grainsBeansAndPasta: ShelfItem[] = [
	{ product: "Beans, dried", pantry: "1-2 Years", refrigerated: "—", pantryAfterOpening: "1 Year" },
	{ product: "Lentils, dried", pantry: "12 Months", refrigerated: "—", pantryAfterOpening: "12 Months" },
	{ product: "Pasta, dry, without eggs", pantry: "2 Years", refrigerated: "—", pantryAfterOpening: "1 Year" },
	{ product: "Dry egg noodles", pantry: "2 Years", refrigerated: "—", pantryAfterOpening: "1-2 Months" },
	{ product: "Peas, dried split", pantry: "12 Months", refrigerated: "—", pantryAfterOpening: "12 Months" },
	{ product: "Rice, white or wild", pantry: "2 Years", refrigerated: "6 Months", pantryAfterOpening: "1 Year" },
	{ product: "Rice, brown", pantry: "1 Year", refrigerated: "6 Months", pantryAfterOpening: "1 Year" },
];

const freshFruits: ShelfItem[] = [
	{ product: "Apples", pantry: "3 Weeks", refrigerated: "4-6 Weeks", frozen: "Cooked: 8 Months" },
	{ product: "Apricots", pantry: "Until ripe", refrigerated: "2-5 Days", frozen: "Do not freeze" },
	{ product: "Avocados", pantry: "Until ripe", refrigerated: "3-4 Days", frozen: "Do not freeze" },
	{ product: "Bananas", pantry: "Until ripe", refrigerated: "3 Days, skin will blacken", frozen: "2-3 Months" },
	{ product: "Berries, cherries, goose berries, lychee", pantry: "Until ripe", refrigerated: "7 Days", frozen: "12 Months" },
	{ product: "Black berries, cherries, currants, raspberries, strawberries", pantry: "Until ripe", refrigerated: "3-6 Days", frozen: "12 Months" },
	{ product: "Blueberries", pantry: "Until ripe", refrigerated: "10 Days", frozen: "12 Months" },
	{ product: "Cherimoya", pantry: "Until ripe", refrigerated: "4 Days", frozen: "10-12 Months" },
	{ product: "Citrus fruit", pantry: "10 Days", refrigerated: "1-3 Weeks", frozen: "Do not freeze" },
	{ product: "Coconut, shredded", pantry: "Unopened: 1 Year; Opened: 6 Months", refrigerated: "8 Months", frozen: "1 Year" },
	{ product: "Coconuts, fresh, whole, unopened", pantry: "1 Week", refrigerated: "2-3 Weeks", frozen: "Do not freeze" },
	{ product: "Cranberries", pantry: "—", refrigerated: "2 Months", frozen: "12 Months" },
	{ product: "Dates", pantry: "2 Months", refrigerated: "12 Months", frozen: "1-2 Years" },
	{ product: "Grapes", pantry: "1 Day", refrigerated: "1 Week", frozen: "Whole, 1 Month" },
	{ product: "Guava", pantry: "Until ripe—they spoil quickly", refrigerated: "2-4 Days", frozen: "Does not freeze well" },
	{ product: "Kiwi fruit", pantry: "Until ripe", refrigerated: "3-6 Days", frozen: "Do not freeze" },
	{ product: "Melons", pantry: "Until ripe, then up to 7 Days", refrigerated: "Whole: 2 Weeks; Cut: 2-4 Days", frozen: "Balls, 1 Month" },
	{ product: "Papaya, mango, passionfruit", pantry: "3-5 Days", refrigerated: "1 Week", frozen: "6-8 Months" },
	{ product: "Peaches, nectarines, plums, pears", pantry: "Until ripe, then 1-2 Days", refrigerated: "3-5 Days", frozen: "Sliced, lemon juice and sugar, 2 Months" },
	{ product: "Pineapple", pantry: "Until ripe, then 1-2 Days", refrigerated: "5-7 Days", frozen: "10-12 Months" },
	{ product: "Plantains", pantry: "Until ripe, then 1-2 Days", refrigerated: "3-5 Days", frozen: "10-12 Months" },
	{ product: "Pomegranate", pantry: "2-5 Days", refrigerated: "1-3 Months", frozen: "10-12 Months" },
];

const freshVegetables: ShelfItem[] = [
	{ product: "Artichokes, whole", pantry: "1-2 Days", refrigerated: "1-2 Weeks", frozen: "Do not freeze" },
	{ product: "Asparagus", pantry: "—", refrigerated: "3-4 Days", frozen: "5 Months" },
	{ product: "Beans and peas", pantry: "—", refrigerated: "3-5 Days", frozen: "8 Months" },
	{ product: "Beets", pantry: "1 Day", refrigerated: "7-14 Days", frozen: "6-8 Months" },
	{ product: "Bok choy", pantry: "—", refrigerated: "2-3 Days", frozen: "10-12 Months" },
	{ product: "Broccoli and broccoli raab", pantry: "—", refrigerated: "3-5 Days", frozen: "10-12 Months" },
	{ product: "Brussels sprouts", pantry: "—", refrigerated: "3-5 Days", frozen: "10-12 Months" },
	{ product: "Cabbage", pantry: "—", refrigerated: "1-2 Weeks", frozen: "10-12 Months" },
	{ product: "Carrots and parsnips", pantry: "—", refrigerated: "2-3 Weeks", frozen: "10-12 Months" },
	{ product: "Cauliflower", pantry: "—", refrigerated: "3-5 Days", frozen: "10-12 Months" },
	{ product: "Celery", pantry: "—", refrigerated: "1-2 Weeks", frozen: "10-12 Months" },
	{ product: "Corn on the cob", pantry: "—", refrigerated: "1-2 Days", frozen: "8 Months" },
	{ product: "Cucumbers", pantry: "—", refrigerated: "4-6 Days", frozen: "Do not freeze" },
	{ product: "Eggplant", pantry: "1 Day", refrigerated: "4-7 Days", frozen: "6-8 Months" },
	{ product: "Garlic", pantry: "1 Month (unbroken bulbs)", refrigerated: "3-14 Days (individual cloves)", frozen: "1 Month" },
	{ product: "Ginger root", pantry: "2-5 Days", refrigerated: "2-3 Weeks", frozen: "6 Months" },
	{ product: "Greens", pantry: "—", refrigerated: "1-4 Days", frozen: "10-12 Months" },
	{ product: "Herbs", pantry: "—", refrigerated: "7-10 Days", frozen: "1-2 Months" },
	{ product: "Leeks", pantry: "—", refrigerated: "1-2 Weeks", frozen: "10-12 Months" },
	{ product: "Lettuce, iceberg, romaine", pantry: "—", refrigerated: "1-2 Weeks", frozen: "Do not freeze" },
	{ product: "Lettuce, leaf, spinach", pantry: "—", refrigerated: "3-7 Days", frozen: "Do not freeze" },
	{ product: "Mushrooms", pantry: "—", refrigerated: "3-7 Days", frozen: "10-12 Months" },
	{ product: "Okra", pantry: "Highly perishable; 1 Day", refrigerated: "2-3 Days", frozen: "10-12 Months" },
	{ product: "Onions, dry", pantry: "1 Month", refrigerated: "2 Months", frozen: "10-12 Months" },
	{ product: "Onions, spring or green", pantry: "1 Month", refrigerated: "1 Week", frozen: "10-12 Months" },
	{ product: "Peppers", pantry: "—", refrigerated: "4-14 Days", frozen: "6-8 Months" },
	{ product: "Potatoes", pantry: "1-2 Months", refrigerated: "1-2 Weeks", frozen: "10-12 Months" },
	{ product: "Pumpkins", pantry: "2-3 Months", refrigerated: "3-5 Months", frozen: "—" },
	{ product: "Radishes", pantry: "—", refrigerated: "10-14 Days", frozen: "Do not freeze" },
	{ product: "Rhubarb", pantry: "—", refrigerated: "3-7 Days", frozen: "—" },
	{ product: "Rutabagas", pantry: "1 Week", refrigerated: "2-3 Weeks", frozen: "8-10 Months" },
	{ product: "Summer squash/zucchini", pantry: "1-5 Days", refrigerated: "4-5 Days", frozen: "10-12 Months" },
	{ product: "Squash, winter", pantry: "2-6 Weeks", refrigerated: "1-3 Months", frozen: "10-12 Months" },
	{ product: "Tamarind", pantry: "1-3 Weeks", refrigerated: "Just the pulp: 6 Months", frozen: "Just the pulp: 1 Year" },
	{ product: "Tomatoes", pantry: "Until ripe, then up to 7 Days", refrigerated: "2-7 Days", frozen: "2 Months" },
	{ product: "Turnips", pantry: "—", refrigerated: "2 Weeks", frozen: "8-10 Months" },
];

const foodsPurchasedFrozen: ShelfItem[] = [
	{ product: "Bagels", frozen: "6 Months", refrigerated: "1-2 Weeks" },
	{ product: "Burritos, sandwiches", frozen: "2 Months (follow package cooking instructions)", refrigerated: "3-4 Days" },
	{ product: "Dough, commercial (bread or cookie)", frozen: "Package use-by date", refrigerated: "After baking, 4-7 Days" },
	{ product: "Egg substitutes", frozen: "12 Months", refrigerated: "Package use-by date" },
	{ product: "Fish, breaded", frozen: "18 Months", refrigerated: "Do not defrost; cook frozen" },
	{ product: "Fish, raw but headed and gutted", frozen: "6 Months", refrigerated: "1-2 Days" },
	{ product: "Frozen potato products (fries, hashbrowns, tater tots)", frozen: "6-12 Months", refrigerated: "3-4 Days" },
	{ product: "Frozen pretzels", frozen: "9-12 Months", refrigerated: "2-3 Weeks" },
	{ product: "Fruits such as berries, melons", frozen: "4-6 Months", refrigerated: "4-5 Days" },
	{ product: "Guacamole", frozen: "3-4 Months", refrigerated: "3-4 Days" },
	{ product: "Ice cream", frozen: "2-4 Months", refrigerated: "Not recommended" },
	{ product: "Ice pops", frozen: "9 Months", refrigerated: "Not recommended" },
	{ product: "Juice concentrates", frozen: "1-2 Years", refrigerated: "7-10 Days" },
	{ product: "Lobster tails", frozen: "2-4 Weeks", refrigerated: "2 Days" },
	{ product: "Pancakes, waffles", frozen: "2 Months", refrigerated: "3-4 Days" },
	{ product: "Sausages, uncooked", frozen: "1-2 Months", refrigerated: "1-2 Days" },
	{ product: "Sausage, precooked", frozen: "1-2 Months", refrigerated: "1 Week" },
	{ product: "Sherbet, sorbet", frozen: "2-4 Months", refrigerated: "Not recommended" },
	{ product: "Shrimp and shellfish", frozen: "12-18 Months", refrigerated: "1-2 Days" },
	{ product: "Soy crumbles and hot dogs", frozen: "9 Months", refrigerated: "3-4 Days" },
	{ product: "Soy meat substitutes", frozen: "12-18 Months", refrigerated: "3-4 Days" },
	{ product: "Tempeh", frozen: "6 Months", refrigerated: "1-2 Weeks" },
	{ product: "Topping, whipped", frozen: "6 Months", refrigerated: "2 Weeks" },
	{ product: "Frozen meals, entrees and breakfast foods", frozen: "3 Months", refrigerated: "Do not defrost; cook frozen" },
	{ product: "Vegetables", frozen: "8 Months", refrigerated: "3-4 Days" },
];

const bakingAndCooking: ShelfItem[] = [
	{ product: "Baking powder", pantry: "6-18 Months", refrigerated: "—", pantryAfterOpening: "3-6 Months" },
	{ product: "Baking soda", pantry: "2-3 Years", refrigerated: "—", pantryAfterOpening: "6 Months" },
	{ product: "Biscuit or pancake mix", pantry: "12 Months", refrigerated: "—", pantryAfterOpening: "Package use-by date" },
	{ product: "Cake, brownie, bread mixes", pantry: "12-18 Months", refrigerated: "—", pantryAfterOpening: "Package use-by date" },
	{ product: "Chocolate, unsweetened and semi-sweet, solid", pantry: "1-2 Years", refrigerated: "—", pantryAfterOpening: "1 Year" },
	{ product: "Cocoa and cocoa mixes", pantry: "Indefinitely", refrigerated: "—", pantryAfterOpening: "1 Year" },
	{ product: "Cornmeal, regular", pantry: "6-12 Months", refrigerated: "1 Year", pantryAfterOpening: "2 Years" },
	{ product: "Cornmeal, stone ground", pantry: "1 Month", refrigerated: "2-4 Months", pantryAfterOpening: "Not recommended" },
	{ product: "Cornstarch", pantry: "18-24 Months", refrigerated: "—", pantryAfterOpening: "18 Months" },
	{ product: "Extracts, vanilla, lemon, etc.", pantry: "4 Years", refrigerated: "—", pantryAfterOpening: "4 Years" },
	{ product: "Flour, white", pantry: "6-12 Months", refrigerated: "1 Year", pantryAfterOpening: "6-8 Months" },
	{ product: "Flour, whole wheat", pantry: "3-6 Months", refrigerated: "6-8 Months", pantryAfterOpening: "—" },
	{ product: "Frosting or icing", pantry: "10-12 Months", refrigerated: "2-3 Weeks", pantryAfterOpening: "Check label" },
	{ product: "Gelatin, flavored", pantry: "18 Months", refrigerated: "—", pantryAfterOpening: "Use entire packet; 3-4 Mos." },
	{ product: "Gelatin, unflavored", pantry: "3 Years", refrigerated: "—", pantryAfterOpening: "Use entire packet" },
	{ product: "Nut oils", pantry: "6 Months", refrigerated: "—", pantryAfterOpening: "—" },
	{ product: "Oils, olive or vegetable", pantry: "6-12 Months", refrigerated: "4 Months", pantryAfterOpening: "3-5 Months" },
	{ product: "Shortening, solid", pantry: "1-2 Years", refrigerated: "—", pantryAfterOpening: "6-12 Months" },
	{ product: "Sugar, brown", pantry: "18 Months", refrigerated: "—", pantryAfterOpening: "Sugar never spoils" },
	{ product: "Sugar, confectioners", pantry: "18 Months", refrigerated: "—", pantryAfterOpening: "Sugar never spoils" },
	{ product: "Sugar, granulated", pantry: "2 Years", refrigerated: "—", pantryAfterOpening: "Sugar never spoils" },
	{ product: "Sugar substitutes", pantry: "2 Years", refrigerated: "Never spoils", pantryAfterOpening: "—" },
	{ product: "Tamarind paste", pantry: "6-12 Months", refrigerated: "2-3 Months", pantryAfterOpening: "6 Months" },
	{ product: "Tapiocas", pantry: "12 Months", refrigerated: "12 Months", pantryAfterOpening: "—" },
	{ product: "Vegetable oil sprays", pantry: "2 Years", refrigerated: "—", pantryAfterOpening: "1 Year" },
	{ product: "Yeast", pantry: "See expiration date", refrigerated: "—", pantryAfterOpening: "—" },
];

const spicesAndHerbs: ShelfItem[] = [
	{ product: "Chili powder", pantry: "2 Years total", pantryAfterOpening: "2 Years" },
	{ product: "Flavored or herb mixes", pantry: "6 Months", pantryAfterOpening: "—" },
	{ product: "Herbs, dried", pantry: "1-2 Years", pantryAfterOpening: "1-2 Years" },
	{ product: "Seasoning blends", pantry: "1-2 Years", pantryAfterOpening: "1-2 Years" },
	{ product: "Spice, ground", pantry: "2-3 Years total", pantryAfterOpening: "2-3 Years" },
	{ product: "Spices, whole", pantry: "3-4 Years total", pantryAfterOpening: "3-4 Years" },
];

const refrigeratedDoughAndPasta: ShelfItem[] = [
	{ product: "Cookie dough", refrigerated: "Package use-by date", frozen: "6 Months" },
	{ product: "Fresh pasta, sold refrigerated", refrigerated: "Package use-by date or 1-2 Days", frozen: "6 Months" },
	{ product: "Ready-to-bake pie crust", refrigerated: "Package use-by date", frozen: "6 Months" },
	{ product: "Tube cans of biscuits, rolls, pizza dough, etc.", refrigerated: "Package use-by date", frozen: "Do not freeze" },
];

const condimentsAndSauces: ShelfItem[] = [
	{ product: "Barbecue sauce, bottled", pantry: "12 Months", refrigerated: "4 Months" },
	{ product: "Chutney", pantry: "12 Months", refrigerated: "1-2 Months" },
	{ product: "Dry cream sauce mixes", pantry: "6-12 Months", refrigerated: "—" },
	{ product: "Dry gravy mixes", pantry: "2 Years", refrigerated: "1-2 Days" },
	{ product: "Gravy, jars and cans", pantry: "2-5 Years", refrigerated: "1-2 Days" },
	{ product: "Honey", pantry: "2 Years*", refrigerated: "—" },
	{ product: "Horseradish, in jar", pantry: "12 Months", refrigerated: "3-4 Months" },
	{ product: "Jams, jellies and preserves", pantry: "6-18 Months", refrigerated: "6-12 Months" },
	{ product: "Ketchup, cocktail or chili sauce", pantry: "12 Months", refrigerated: "6 Months" },
	{ product: "Marinades", pantry: "1 Year", refrigerated: "6 Months" },
	{ product: "Mayonnaise, commercial", pantry: "3-6 Months", refrigerated: "For best quality: 2 Months" },
	{ product: "Mustard", pantry: "1-2 Years", refrigerated: "12 Months" },
	{ product: "Olives, black and green", pantry: "12-18 Months", refrigerated: "2 Weeks" },
	{ product: "Pickles", pantry: "12 Months", refrigerated: "1-3 Months" },
	{ product: "Pesto, jarred", pantry: "6 Months", refrigerated: "Refrigerator: 3 Days; Freezer: 1 Month" },
	{ product: "Pesto, refrigerated", pantry: "—", refrigerated: "Unopened: 1 Week; Opened: 3 Days" },
	{ product: "Salad dressings, commercial, bottled", pantry: "10-12 Months", refrigerated: "1-3 Months" },
	{ product: "Salsa, picante and taco sauces", pantry: "12 Months", refrigerated: "1 Month" },
	{ product: "Sauce mixes, nondairy (spaghetti, taco, etc.)", pantry: "2 Years", refrigerated: "—" },
	{ product: "Spaghetti sauce in jars", pantry: "18 Months", refrigerated: "4 Days" },
	{ product: "Soy sauce or teriyaki sauce", pantry: "3 Years", refrigerated: "1 Month" },
	{ product: "Vinegar", pantry: "2 Years", refrigerated: "1 Year" },
	{ product: "Worcestershire sauce", pantry: "2 Years", refrigerated: "1 Year" },
];

const babyFood: ShelfItem[] = [
	{ product: "Baby food, jars or pouches", pantry: "Package use-by date", refrigerated: "2-3 Days" },
	{ product: "Baby food, fruit", pantry: "Package use-by date", refrigerated: "3 Days" },
	{ product: "Baby food, vegetables", pantry: "Package use-by date", refrigerated: "2 Days" },
	{ product: "Baby food, dinners", pantry: "Package use-by date", refrigerated: "2 Days" },
	{ product: "Baby food, cereal and dry mixes", pantry: "Package use-by date", refrigerated: "1-2 Months", pantryAfterOpening: "2 Months" },
	{ product: "Formula, prepared", pantry: "Package use-by date", refrigerated: "24 Hours", pantryAfterOpening: "1 Hour" },
	{ product: "Liquid concentrate or ready-to-feed formula", pantry: "Package use-by date", refrigerated: "48 Hours" },
];

const shelfStableMeat: ShelfItem[] = [
	{ product: "Bacon, fully cooked", pantry: "Unopened, until the package use-by date", refrigerated: "5-14 Days" },
	{ product: "Ham, shelf-stable cans", pantry: "6-9 Months in the pantry", refrigerated: "3-4 Days" },
	{ product: "Jerky, commercially dried", pantry: "1-2 Months", refrigerated: "2-3 Months" },
	{ product: "Jerky, homemade", pantry: "1-2 Months", refrigerated: "1-2 Months" },
	{ product: "Meat products, canned", pantry: "5 Years", refrigerated: "3-4 Days" },
	{ product: "Retort pouches or boxes", pantry: "Use package recommendations", refrigerated: "3-4 Days" },
];

const shelfStableOther: ShelfItem[] = [
	{ product: "Applesauce, commercial", pantry: "12-18 Months", refrigerated: "7-10 Days", pantryAfterOpening: "Don't store in pantry after opening" },
	{ product: "Bacon bits, imitation", pantry: "1 Year", refrigerated: "Package use-by date", pantryAfterOpening: "1 Year" },
	{ product: "Canned goods, low acid (meat, poultry, fish, gravy, stew, soups, beans, carrots, corn, pasta, peas, potatoes, spinach)", pantry: "2-5 Years", refrigerated: "3-4 Days",	pantryAfterOpening: "Do not store in pantry after opening", },
	{ product: "Canned goods, high acid (juices, fruit, pickles, sauerkraut, tomato soup, & vinegar-based sauces)", pantry: "12-18 Months", refrigerated: "5-7 Days", pantryAfterOpening: "Do not store in pantry after opening", },
	{ product: "Cereal, ready-to-eat", pantry: "6-12 Months", pantryAfterOpening: "2-3 Months" },
	{ product: "Cereal, cook before eating (oatmeal, etc.)", pantry: "12 Months", pantryAfterOpening: "6-12 Months" },
	{ product: "Chocolate syrup", pantry: "2 Years", refrigerated: "6 Months", pantryAfterOpening: "Not recommended" },
	{ product: "Crackers", pantry: "8 Months", refrigerated: "Refrigerator or freezer: 3-4 Months", pantryAfterOpening: "1 Month" },
	{ product: "Garlic, chopped, commercial jars", pantry: "8-12 Months", refrigerated: "Refrigerate: package use-by date" },
	{ product: "Graham crackers, animal crackers", pantry: "6-9 Months" },
	{ product: "Fruits, dried", pantry: "6 Months", refrigerated: "6 Months", pantryAfterOpening: "1 Month" },
	{ product: "Gummy (fruit) snacks", pantry: "6-9 Months", pantryAfterOpening: "6 Months" },
	{ product: "Marshmallows", pantry: "1 Year", pantryAfterOpening: "1 Month" },
	{ product: "Marshmallow crème", pantry: "2-5 Months", pantryAfterOpening: "1 Month" },
	{ product: "Milk, canned evaporated or condensed", pantry: "12 Months", refrigerated: "4-5 Days" },
	{ product: "Molasses", pantry: "1-2 Years", pantryAfterOpening: "6 Months" },
	{ product: "Mushrooms, dried", pantry: "1-2 Years", pantryAfterOpening: "3 Months" },
	{ product: "Nuts, jars or cans", pantry: "12 Months", refrigerated: "Refrigerator: 4-6 Months; Freezer: 6-12 Months", pantryAfterOpening: "2-9 Months" },
	{ product: "Peanut butter, commercial", pantry: "6-24 Months", pantryAfterOpening: "2-3 Months" },
	{ product: "Pectin", pantry: "Package use-by date", pantryAfterOpening: "1 Month" },
	{ product: "Popcorn, dry kernels in jar", pantry: "2 Years", pantryAfterOpening: "1 Year" },
	{ product: "Popcorn, commercial popping bags", pantry: "2-3 Months", pantryAfterOpening: "1-2 Weeks" },
	{ product: "Popcorn, microwave packets", pantry: "6-12 Months", pantryAfterOpening: "1-2 Days popped" },
	{ product: "Potato chips", pantry: "Package use-by date; 2 Months", pantryAfterOpening: "1-2 Weeks" },
	{ product: "Potatoes, instant", pantry: "10-15 Months", pantryAfterOpening: "6-12 Months" },
	{ product: "Pretzels", pantry: "4-9 Months", pantryAfterOpening: "3 Weeks" },
	{ product: "Pudding mixes", pantry: "12 Months", pantryAfterOpening: "3-4 Months" },
	{ product: "Soup mixes, dry bouillon", pantry: "12 Months", pantryAfterOpening: "12 Months" },
	{ product: "Sun dried tomatoes", pantry: "1 Year", refrigerated: "3-6 Months", pantryAfterOpening: "3-6 Months" },
	{ product: "Syrup, genuine or real maple", pantry: "12 Months", refrigerated: "6 Months", pantryAfterOpening: "Not recommended" },
	{ product: "Syrup, pancake", pantry: "12 Months", refrigerated: "12 Months", pantryAfterOpening: "12 Months" },
	{ product: "Toaster pastries", pantry: "6-12 Months", pantryAfterOpening: "1-2 Weeks" },
];

const beverages: ShelfItem[] = [
	{ product: "Coffee, whole beans", pantry: "3-5 Months", refrigerated: "For all types, 3-4 Months", pantryAfterOpening: "3-5 Months" },
	{ product: "Coffee, ground, non-vacuum", pantry: "3-5 Months", refrigerated: "Freezer: 1-2 Years", pantryAfterOpening: "3-5 Weeks" },
	{ product: "Coffee, instant", pantry: "12 Months", pantryAfterOpening: "2-3 Months" },
	{ product: "Diet powder mixes and drink mixes", pantry: "18-24 Months", pantryAfterOpening: "1-3 Months" },
	{ product: "Juice, sold refrigerated", refrigerated: "Package use-by date or 6-10 Days" },
	{ product: "Juice, sold shelf stable (bottles, boxes or cans)", pantry: "Package best-by date or 4-12 Months", refrigerated: "Package use-by date or 8-12 Days" },
	{ product: "Nectar (papaya, mango, guava)", pantry: "12-18 Months", refrigerated: "Refrigerator: 5-7 Days; Freezer: 8-12 Months" },
	{ product: "Soda such as carbonated cola drinks, mixers, diet sodas, bottles or cans", pantry: "Package use-by date (about 3 months for bottles; 9 months for cans)", refrigerated: "2-3 Days", pantryAfterOpening: "2-3 Days" },
	{ product: "Soy or rice beverage", pantry: "Refrigerator unopened: 6 Months", refrigerated: "Refrigerator: 7-10 Days; Freezer: 3 Months" },
	{ product: "Soy or rice beverage, refrigerated", pantry: "Refrigerator unopened: 6 Months", refrigerated: "Refrigerator: 7-10 Days; Freezer: 3 Months" },
	{ product: "Tea, bags", pantry: "18-36 Months", pantryAfterOpening: "6-12 Months" },
	{ product: "Tea, instant", pantry: "2-3 Years", pantryAfterOpening: "6-12 Months" },
	{ product: "Tea, loose", pantry: "2 Years", refrigerated: "Only Matcha can be frozen after opening", pantryAfterOpening: "6-12 Months" },
	{ product: "Water", pantry: "1-2 Years", refrigerated: "2 Weeks", pantryAfterOpening: "3 Months" },
];

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

const Table = ({
	title,
	data,
	color,
	search,
	pantryLabel,
	refrigeratedLabel = "Refrigerated",
	frozenLabel = "Frozen",
	pantryAfterOpeningLabel,
}: {
	title: string;
	data: ShelfItem[];
	color: string;
	search: string;
	pantryLabel?: string;
	refrigeratedLabel?: string;
	frozenLabel?: string;
	pantryAfterOpeningLabel?: string;
	
}) => {
	const filteredData = data.filter((item) =>
		item.product.toLowerCase().includes(search.toLowerCase())
	);

	if (filteredData.length === 0) return null;

	const showPantry = filteredData.some((item) => item.pantry !== undefined); //for ShelfItems with pantry column
	const showRefrigerated = filteredData.some((item) => item.refrigerated !== undefined);
	const showFrozen = filteredData.some((item) => item.frozen !== undefined);
	const showPantryAfterOpening = filteredData.some(
		(item) => item.pantryAfterOpening !== undefined
	);

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
						{showPantry && <th style={th}>{pantryLabel}</th>}
						{showRefrigerated && <th style={th}>{refrigeratedLabel}</th>}
						{showFrozen && <th style={th}>{frozenLabel}</th>}
						{showPantryAfterOpening && (
							<th style={th}>{pantryAfterOpeningLabel ?? "Pantry After Opening"}</th>
						)}
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
							{showPantry && <td style={td}>{item.pantry ?? "—"}</td>}
							{showRefrigerated && <td style={td}>{item.refrigerated ?? "—"}</td>}
							{showFrozen && <td style={td}>{item.frozen ?? "—"}</td>}
							{showPantryAfterOpening && (
								<td style={td}>{item.pantryAfterOpening ?? "—"}</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
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

			{/* Search */}
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

			<Table
				title="Deli and Prepared Foods"
				data={deliAndPreparedFoods}
				color="#743716"
				search={search}
			/>

			<Table
				title="Bakery Products"
				data={bakeryProducts}
				color="#b45309"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator After Opening"
			/>

			<Table
				title="Grains, Beans & Pasta"
				data={grainsBeansAndPasta}
				color="#d97706"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator After Opening"
				pantryAfterOpeningLabel="In Pantry After Opening"
			/>

			<Table
				title="Fresh Fruits"
				data={freshFruits}
				color="#be185d"
				search={search}
				pantryLabel="Pantry"
				refrigeratedLabel="Refrigerator"
				frozenLabel="Freezer"
			/>

			<Table
				title="Fresh Vegetables"
				data={freshVegetables}
				color="#15803d"
				search={search}
				pantryLabel="Pantry"
				refrigeratedLabel="Raw, Refrigerator"
				frozenLabel="Frozen"
			/>

			<Table
				title="Foods Purchased Frozen"
				data={foodsPurchasedFrozen}
				color="#6b21a8"
				search={search}
				refrigeratedLabel="Refrigerator After Thawing"
				frozenLabel="Freezer"
			/>

			<Table
				title="Baking and Cooking"
				data={bakingAndCooking}
				color="#c2410c"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator After Opening"
				pantryAfterOpeningLabel="In Pantry After Opening"
			/>

			<Table
				title="Spices and Herbs"
				data={spicesAndHerbs}
				color="#b45309"
				search={search}
				pantryLabel="Unopened in Pantry"
				pantryAfterOpeningLabel="In Pantry After Opening"
			/>

			<Table
				title="Refrigerated Dough and Pasta"
				data={refrigeratedDoughAndPasta}
				color="#0284c7"
				search={search}
				refrigeratedLabel="Refrigerated"
				frozenLabel="Frozen"
			/>

			<Table
				title="Condiments & Sauces"
				data={condimentsAndSauces}
				color="#b91c1c"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator After Opening"
			/>

			<Table
				title="Shelf Stable Food — Baby Food"
				data={babyFood}
				color="#0ea5e9"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator After Opening"
				pantryAfterOpeningLabel="In Pantry After Opening"
			/>

			<Table
				title="Shelf Stable Foods — Meat and Poultry"
				data={shelfStableMeat}
				color="#0284c7"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerate After Opening"
			/>

			<Table
				title="Shelf Stable Foods — Other Items"
				data={shelfStableOther}
				color="#0369a1"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator After Opening"
				pantryAfterOpeningLabel="In Pantry After Opening"
			/>

			<Table
				title="Beverages"
				data={beverages}
				color="#be185d"
				search={search}
				pantryLabel="Unopened in Pantry"
				refrigeratedLabel="Refrigerator after Opening"
				pantryAfterOpeningLabel="In Pantry After Opening"
			/>
		</div>
	);
}
