export const tasteGroupsFormValues = [
  {
    group: "🍭 Sweet",
    tastes: ["Sweet", "Vanilla", "Caramel", "Chocolate"],
  },
  {
    group: "🍎 Fruity",
    tastes: ["Citrus", "Berry", "Apple/Pear", "Tropical"],
  },
  {
    group: "🌿 Fresh",
    tastes: ["Herbal", "Minty", "Floral"],
  },
  {
    group: "🔥 Bold",
    tastes: ["Spicy", "Smoky", "Woody"],
  },
];

export const tastes = [
  { label: "Sweet", color: "#FFD1DC" },
  { label: "Vanilla", color: "#F3E5AB" },
  { label: "Caramel", color: "#C68E17" },
  { label: "Chocolate", color: "#7B3F00" },
  { label: "Citrus", color: "#FFA500" },
  { label: "Berry", color: "#D10056" },
  { label: "Apple/Pear", color: "#A2C523" },
  { label: "Tropical", color: "#FFCC00" },
  { label: "Herbal", color: "#6B8E23" },
  { label: "Minty", color: "#98FF98" },
  { label: "Floral", color: "#FFB6C1" },
  { label: "Spicy", color: "#FF4500" },
  { label: "Smoky", color: "#8B4513" },
  { label: "Woody", color: "#A0522D" },
];

// select color from the array
export const selectColor = (value: string) => {
  const match = tastes.find((val) => val.label === value);
  if (match) {
    return match.color;
  } else {
    return "white";
  }
};

// if in array filter it out
export const toggleSelectedTaste = (selected: string[], taste: string) => {
  if (selected.includes(taste)) {
    return selected.filter((val) => val !== taste);
  }
  return [...selected, taste];
};
