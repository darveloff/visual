export type TokenMap = {
  colors: {
    background: string;
    foreground: string;
    accentGradientFrom: string;
    accentGradientTo: string;
  };
  spacing: {
    section: string;
    container: string;
  };
  radius: {
    card: string;
  };
};

export function mapTokens(): TokenMap {
  return {
    colors: {
      background: "#09090B",
      foreground: "#F4F4F5",
      accentGradientFrom: "#7C3AED",
      accentGradientTo: "#06B6D4",
    },
    spacing: {
      section: "5rem",
      container: "1.5rem",
    },
    radius: {
      card: "1rem",
    },
  };
}
