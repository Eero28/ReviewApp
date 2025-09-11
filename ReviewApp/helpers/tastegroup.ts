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
  { label: "Sweet", color: "#FFD1DC", textColor: "#000" },
  { label: "Vanilla", color: "#F3E5AB", textColor: "#000" },
  { label: "Caramel", color: "#C68E17", textColor: "#fff" },
  { label: "Chocolate", color: "#7B3F00", textColor: "#fff" },
  { label: "Citrus", color: "#FFA500", textColor: "#000" },
  { label: "Berry", color: "#D10056", textColor: "#fff" },
  { label: "Apple/Pear", color: "#A2C523", textColor: "#000" },
  { label: "Tropical", color: "#FFCC00", textColor: "#000" },
  { label: "Herbal", color: "#6B8E23", textColor: "#fff" },
  { label: "Minty", color: "#98FF98", textColor: "#000" },
  { label: "Floral", color: "#FFB6C1", textColor: "#000" },
  { label: "Spicy", color: "#FF4500", textColor: "#fff" },
  { label: "Smoky", color: "#8B4513", textColor: "#fff" },
  { label: "Woody", color: "#A0522D", textColor: "#fff" },
];

// select color from the array
export const selectColor = (value: string) => {
  const match = tastes.find((val) => val.label === value);
  if (match) {
    return { color: match.color, textColor: match.textColor };
  } else {
    return { color: "white", textColor: "#000" };
  }
};

// if in array filter it out
export const toggleSelectedTaste = (selected: string[], taste: string) => {
  if (selected.includes(taste)) {
    return selected.filter((val) => val !== taste);
  }
  return [...selected, taste];
};
