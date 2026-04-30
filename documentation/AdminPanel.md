# Admin Panel Documentation

## Overview

The Admin Panel provides tools for managing dynamic content within the application. This includes recipes, community resources, community partners, safety links, and advertisements (sponsors). Changes made through the admin panel are reflected immediately across the site.

---

## Accessing the Admin Panel

1. Navigate to the admin panel:

    * Either by clicking the "Admin Panel" link in the footer
    * Or directly via the URL:  

    ```
    https://thrifty-bites.vercel.app/admin-login
    ```
2. Log in using authorized credentials.
3. Once logged in, you will have access to all management features.

---

## Main Features

### 1. Ingredient Management

Ingredients are crucial for recipe cost calculations. Each ingredient must be set up before it can be used in recipes. Admins can create, edit, and delete ingredients.

#### Important Fields

* `en/es`: Name of the ingredient in English and Spanish
* `price`: Total cost of the package
* `packageSize`: Size of the package (oz, count, etc.)
* `baseUnit`: Unit of measurement per price (each, cup, tbsp, etc.)

#### Notes

* Ensure units are consistent (e.g., oz, each, fl oz)
* Missing conversions will cause errors
* Example error:

  ```
  Missing conversion: mL -> fl
  ```
* Fix by adding conversion logic in the system
* Most common conversions are already defined, but custom units may require additional setup
* Mitigate issues by using each and using the price of a single item when possible (e.g., 1 egg = 1 each)

---

### 2. Recipe Management

Admins can create, edit, and delete recipes once ingredients are set up. Recipes include details like title, ingredients, instructions, images, and tags.

#### Adding a Recipe

* Click **"Add Recipe"**
* Fill in:

  * Image
  * Title (English & Spanish)
  * Instructions (English & Spanish)
  * Ingredients Plaintext (one per line, format: `4 Cans Black Beans, undrained`, OPTIONAL: if not used it will default to the entered ingredients)
  * Ingredients (list of ingredient entries to select from and choose units and amounts)
  * Tags (Vegan, Vegetarian, etc.)
  * Allergens (Wheat, Dairy, etc.)
  * Appliances (Oven, Stove, etc.)
  * Category (breakfast, lunch/dinner, dessert)

* Click **Save**

#### Editing a Recipe

* Select a recipe from the list and click **Edit**
* Modify any fields
* Click **Save**

#### Deleting a Recipe

* Select a recipe from the list
* Click the **Delete** button on the recipes card
* Confirm the action

#### Notes
* Ensure all ingredients used in the recipe are properly set up with correct units and pricing to avoid cost calculation issues
* Use consistent naming for ingredients across recipes to maintain clarity and avoid confusion
* When adding images, ensure they are properly sized and optimized for web use to maintain site performance (use webp format when possible).
* Optional fields: Ingredients Plaintext (English & Spanish)
    * if not entered it will default back to the entered ingredients
---

### 3. Featured Recipes

Control which recipes are featured on the homepage. Featured recipes are displayed prominently to users.

#### Adding a Featured Recipe
  * Select a recipe from the list of recipes
  * Click the **Add** button
      * select 3 recipes in total for best look

#### Removing a Featured Recipe
  * Select a recipe from the list of recipes
  * Click the **Remove** button

### Notes
  * Featured recipes are displayed in the order they were added (can be changed by removing and re-adding in desired order)
  * Ensure featured recipes have images for better visual appeal on the homepage
  * Below this section, there is analytic data showing the most viewed recipes, which can help inform which recipes to feature
  * 3 Featured Recipes are shown on the homepage.

---

### 4. Community Resources

Manage links and images to external community resources and pages.

#### Adding a Resource

* Enter:

  * Title (EN/ES)
  * Image (optional)
  * Description (EN/ES)
  * Link (URL)

* Click **Save**

#### Editing / Deleting

* Select item with **Edit** button
* edit fields or delete by clicking the **Delete** button

---

### 5. Community Partners

Similar to resources but used for partner organizations.

#### Adding a Partner

* Enter:

  * Title (EN/ES)
  * Image (optional)
  * Description (EN/ES)
  * Link (URL)

* Click **Save**

#### Editing / Deleting

* Select item with **Edit** button
* edit fields or delete by clicking the **Delete** button

#### Features

* External links (open in new tab)
* Ordered display based on what was entered first (can be changed by deleting and re-adding in desired order or modified in the database)

---

### 6. Advertisements (Sponsors)

Controls logos shown on the homepage under the Partners section.

#### Adding a Sponsor

* Name
* Image
* link (Optional)

#### Special Behavior

* If exactly 3 sponsors exist:

  * Middle sponsor is emphasized (larger scale)

* If more:

  * Grid layout is used

---

### 7. Submitted Recipes

Users can submit recipes using the site and admins can approve and view new recipe submissions.

#### Edit Recipe Submission

  * click the **Edit** button to edit the submitted recipe.
  * edit the fields as desired.
  * click the **Save** button to save.

#### Approve Recipe Submission

  * click the **Approve** button on the desired recipe

#### Delete Recipe Submission
  * click the **Delete** button on the desired recipe
  * Or click the **Edit** button and then at the button click **Delete**

---

### 8. Language Support

All major fields support:

* English (`en`)
* Spanish (`es`)

Ensure both are filled when adding content.

---

## Measurement Conversion System

The admin panel relies on unit conversions for ingredient cost calculations.

### Supported Units

* each
* oz
* cup
* tbsp
* tsp
* fl oz

### Common Issues

* Missing conversion mappings will cause runtime errors
* Example:

  ```
  Missing conversion: count -> oz
  ```

### Fix

Add conversion rules to the database to handle new units or ensure consistent use of supported units. For example, if using "count" for items like eggs, ensure that the price is set for a single item (e.g., 1 egg = 1 each) to avoid conversion issues. Quickly mitigate by using "each" and setting the price for a single item when possible.

---

## Best Practices

* Always verify ingredient units before saving
* Keep naming consistent across English and Spanish
* Use realistic pricing for accurate cost calculation
* Test recipes after creating them
* Avoid leaving optional fields blank if they affect UI (like images)

---

## Troubleshooting

### Issue: Prices look incorrect

* Check:

  * `costPerUnit`
  * `multiplier`: Value used to convert between units
  * `packageSize`
  * `baseUnit`
  * `price`

---

### Issue: Conversion errors

* Ensure unit exists in conversion map
* Add missing conversion
* Use each and price per item to avoid complex conversions when possible

---

### Issue: Layout/UI looks broken

* Check for missing images or long text
* Verify mobile responsiveness
* Check wifi connection (some assets may not load properly if connection is blocked)

---

## Final Notes

The admin panel is designed to be flexible but relies on correct data entry. Most issues arise from inconsistent units or missing values.

When in doubt:

* Check units
* Check conversions
* Check pricing math

---
