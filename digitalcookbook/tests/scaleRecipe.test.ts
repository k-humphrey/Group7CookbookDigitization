/// <reference types="jest" />

import { scaleIngredient, scaleCost } from "@/lib/scaleRecipe";

// Test suite for scaleRecipe functions
describe("Test scaleRecipe functions", () => {
    // Test scaling of total cost
    describe("scaleCost", () => {
        it("should scale cost correctly based on desired servings", () => {
            const {scaleFactor, scaledCost} = scaleCost(10, 8);

            // should double the cost and return a scale factor of 2
            expect(scaleFactor).toBe(2);
            expect(scaledCost).toBe(20);
        });
    });

    // Test scaling of ingredient string
    describe("scaleIngredient", () => {
        it("should scale ingredient quantity correctly based on scale factor (no fraction)", () => {
            const scaledIngredient = scaleIngredient("2 cups flour", 0.5);

            // should halve the quantity to 1 cups
            expect(scaledIngredient).toBe("1 cups flour");
        });

        it("should scale ingredient quantity correctly based on scale factor (altCode fraction)", () => {
            const scaledIngredient = scaleIngredient("1 ½ cups flour", 2);

            // should double the quantity to 3 cups
            expect(scaledIngredient).toBe("3 cups flour");
        });

        it("should scale ingredient quantity correctly based on scale factor (standard fraction)", () => {
            const scaledIngredient = scaleIngredient("1 1/2 cups flour", 2);

            // should double the quantity to 3 cups
            expect(scaledIngredient).toBe("3 cups flour");
        });

        it("should handle scaling of ingredients with ounces without converting to fraction", () => {
            const scaledIngredient = scaleIngredient("1 Can White Tuna in Water (12oz) - drained & flaked", 3);

            // should triple the quantity to 3 cans but keep the ounce measurement as is
            expect(scaledIngredient).toBe("3 Can White Tuna in Water (12oz) - drained & flaked");
        });

        it("should handle scaling complex ingredient strings with multiple numbers and units", () => {
            const scaledIngredient = scaleIngredient("18 Slices Crispy Cooked Bacon OR 1/2 Bag Real Bacon Pieces", 2);

            // should double the quantity to 36 slices or 1 full bag
            expect(scaledIngredient).toBe("36 Slices Crispy Cooked Bacon OR 1 Bag Real Bacon Pieces");
        });

        it("should handle scaling complex ingredient strings with multiple numbers, units, and measurements", () => {
            const scaledIngredient = scaleIngredient("2 Carrots – peeled and cut into ½” pieces", 2);
            const scaledIngredient2 = scaleIngredient("2 Carrots – peeled and cut into ½-inch pieces", 2);

            // should double the quantity to 4 Carrots but keep the measurement of ½” pieces as is
            expect(scaledIngredient).toBe("4 Carrots – peeled and cut into ½” pieces");
            expect(scaledIngredient2).toBe("4 Carrots – peeled and cut into ½-inch pieces");
        });

    });
});