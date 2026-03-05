// Fractional representations for formatting
const fractions = [
{ value: 1 / 8, label: "⅛" },
{ value: 1 / 6, label: "⅙" },
{ value: 1 / 4, label: "¼" },
{ value: 1 / 3, label: "⅓" },
{ value: 1 / 2, label: "½" },
{ value: 2 / 3, label: "⅔" },
{ value: 3 / 4, label: "¾" },
];

// decimal to fraction representation
export function decimalToFraction(value: number, unit: string): string {
    const wholeNumber = Math.floor(value);
    const remainder = value - wholeNumber;

    // for ounce, return as decimal or whole number
    if (unit === "oz") return remainder === 0 ? value.toFixed(0) : value.toFixed(2);

    // find closest fraction
    let best: { label: string; value: number } | null = null;
    for (const frac of fractions) {
        if (!best || Math.abs(remainder - frac.value) < Math.abs(remainder - best.value)) {
        best = frac;
        }
    }

    // Determine if the fraction is close enough to be used (within 0.05)
    const fractionLabel = remainder > 0.05 && best?.label ? best.label : "";

    // Round results
    if (remainder >= 0.9) 
        return `${wholeNumber + 1}`; // Round up to next whole number if close enough
    if (fractionLabel) 
        return wholeNumber ? `${wholeNumber} ${fractionLabel}` : fractionLabel; // Combine whole number and fraction if both exist
    if (remainder === 0) 
        return `${wholeNumber}`; // Return just the whole number if no fractional part

    return value.toFixed(2); // Fallback to decimal representation if no good fraction match
    
}

// fraction representation to decimal
export function fractionToDecimal(value: string): number {
    value = value.trim();
    
    // check for mixed number (e.g. "1 ½")
    const parts = value.split(" ");
    if (parts.length === 2)
        return Number(parts[0]) + fractionToDecimal(parts[1]);

    // check for simple fraction (e.g. "½")
    const fraction = fractions.find(f => f.label === value);
    if(fraction)
        return fraction.value;

    // check for slash-separated fraction (e.g. "1/2 cup")
    if(value.includes("/")) {
        const [numerator, denominator] = value.split("/").map(Number);
        return numerator / denominator;
    }

    // return whole number
    return Number(value);
}