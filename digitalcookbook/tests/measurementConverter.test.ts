/// <reference types="jest" />

import { conversionsToOz } from "../app/measurement-converter/measurement";
import { decimalToFraction } from "@/lib/fractionConverter";

// Test suite for Measurement Converter
describe("Test Measurement Converter", () => {

    // Test conversion of 4 cups to all units
    test("4 cups converts correctly", () => {
        const oz = 4 * conversionsToOz.cup;
        const gallons = oz / conversionsToOz.gallon;

        // Check conversions to all units
        expect(decimalToFraction(oz / conversionsToOz.cup, "cup")).toBe("4");
        expect(decimalToFraction(oz / conversionsToOz.gallon, "gallon")).toBe("¼");
        expect(decimalToFraction(oz / conversionsToOz.quart, "quart")).toBe("1");
        expect(decimalToFraction(oz / conversionsToOz.pint, "pint")).toBe("2");
        expect(decimalToFraction(oz / conversionsToOz.tbsp, "tbsp")).toBe("64");
        expect(decimalToFraction(oz / conversionsToOz.tsp, "tsp")).toBe("192");
        expect(decimalToFraction(oz / conversionsToOz.oz, "oz")).toBe("32");
        
    });

    // Test conversion of zero to all units
    test("0 renders as 0", () => {
        const oz = 0;

        // Check conversions to all units
        expect(decimalToFraction(oz / conversionsToOz.cup, "cup")).toBe("0");
        expect(decimalToFraction(oz / conversionsToOz.gallon, "gallon")).toBe("0");
        expect(decimalToFraction(oz / conversionsToOz.quart, "quart")).toBe("0");
        expect(decimalToFraction(oz / conversionsToOz.pint, "pint")).toBe("0");
        expect(decimalToFraction(oz / conversionsToOz.tbsp, "tbsp")).toBe("0");
        expect(decimalToFraction(oz / conversionsToOz.tsp, "tsp")).toBe("0");
        expect(decimalToFraction(oz / conversionsToOz.oz, "oz")).toBe("0");
    });

    // Test conversion of mixed fraction to all units
    test("1.5 cups converts correctly", () => {
        const oz = 1.5 * conversionsToOz.cup;

        // Check conversions to all units
        expect(decimalToFraction(oz / conversionsToOz.cup, "cup")).toBe("1 ½");
        expect(decimalToFraction(oz / conversionsToOz.gallon, "gallon")).toBe("⅛");
        expect(decimalToFraction(oz / conversionsToOz.quart, "quart")).toBe("⅓");
        expect(decimalToFraction(oz / conversionsToOz.pint, "pint")).toBe("¾");
        expect(decimalToFraction(oz / conversionsToOz.tbsp, "tbsp")).toBe("24");
        expect(decimalToFraction(oz / conversionsToOz.tsp, "tsp")).toBe("72");
        expect(decimalToFraction(oz / conversionsToOz.oz, "oz")).toBe("12");
    });

});
