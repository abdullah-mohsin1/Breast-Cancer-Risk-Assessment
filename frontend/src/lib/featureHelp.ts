export type FeatureHelp = {
  unit?: string;   // "mm", "mm²", "unitless", "count"
  what: string;    // simple definition
  how: string;     // how it's typically obtained
};

export const FEATURE_HELP: Record<string, FeatureHelp> = {
  // ---- MEANS (10) ----
  radius_mean: {
    unit: "mm",
    what: "Average radius of the cell nuclei (size proxy).",
    how: "Computed by imaging software from the medical image; not measured manually."
  },
  texture_mean: {
    unit: "unitless",
    what: "Variation in pixel brightness (standard deviation).",
    how: "Calculated by software from the image; no physical units."
  },
  perimeter_mean: {
    unit: "mm",
    what: "Average length around the nuclei boundary.",
    how: "Measured by software along the contour in the image."
  },
  area_mean: {
    unit: "mm²",
    what: "Average area inside the nuclei boundary.",
    how: "Computed by software from the contour."
  },
  smoothness_mean: {
    unit: "unitless",
    what: "How smooth vs. bumpy the boundary is (local radius variation).",
    how: "Derived metric from the image; no physical units."
  },
  compactness_mean: {
    unit: "unitless",
    what: "How tightly packed the shape is (related to perimeter²/area).",
    how: "Calculated by software; dimensionless ratio."
  },
  concavity_mean: {
    unit: "unitless",
    what: "Depth/severity of inward dents (concave parts) on the boundary.",
    how: "Computed from the contour; dimensionless."
  },
  "concave points_mean": {
    unit: "count",
    what: "Average number of concave indentations on the boundary.",
    how: "Counted by software; reported as a count (no units)."
  },
  symmetry_mean: {
    unit: "unitless",
    what: "How symmetric the shape is (ratio of axes).",
    how: "Derived from the outline; no units."
  },
  fractal_dimension_mean: {
    unit: "unitless",
    what: "Boundary complexity ('coastline' roughness).",
    how: "Computed by software; typically near ~1.0; no units."
  },

  // ---- WORST (4) ----
  radius_worst: {
    unit: "mm",
    what: "Average of the three largest radius values (most abnormal nuclei).",
    how: "Computed by software; units same as radius."
  },
  perimeter_worst: {
    unit: "mm",
    what: "Average of the three largest perimeter values.",
    how: "Computed by software; units same as perimeter."
  },
  area_worst: {
    unit: "mm²",
    what: "Average of the three largest area values.",
    how: "Computed by software; units same as area."
  },
  concavity_worst: {
    unit: "unitless",
    what: "Average of the three largest concavity values.",
    how: "Computed by software; dimensionless."
  },

  // ---- SE (2) ----
  radius_se: {
    unit: "mm",
    what: "Standard error of the mean radius (uncertainty of the average).",
    how: "Software computes SE = SD / √N; units match radius."
  },
  concavity_se: {
    unit: "unitless",
    what: "Standard error of the mean concavity.",
    how: "SE of a unitless metric remains unitless."
  },
};
