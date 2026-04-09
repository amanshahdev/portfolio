export function alphaColor(color, alpha) {
  if (color === "var(--phosphor)") {
    return `rgba(var(--phosphor-rgb), ${alpha})`;
  }

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalizedHex =
      hex.length === 3
        ? hex
            .split("")
            .map((character) => character + character)
            .join("")
        : hex;
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");

    return `#${normalizedHex}${alphaHex}`;
  }

  return color;
}
