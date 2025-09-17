export const tasteGroupsFormValues = [
  {
    group: "🍭 Sweet",
    tastes: ["Sweet", "Vanilla", "Caramel", "Chocolate"],
    color: "#FFD1DC",
    textColor: "#000",
  },
  {
    group: "🍎 Fruity",
    tastes: ["Citrus", "Berry", "Apple", "Pear", "Tropical"],
    color: "#FFA500",
    textColor: "#000",
  },
  {
    group: "🌿 Fresh",
    tastes: ["Herbal", "Minty", "Floral"],
    color: "#6B8E23",
    textColor: "#000",
  },
  {
    group: "🔥 Bold",
    tastes: ["Spicy", "Smoky", "Woody"],
    color: "#FF4500",
    textColor: "#000",
  },
];

export const selectColor = (value: string) => {
  const match = tasteGroupsFormValues.find((val) => val.tastes.includes(value));
  if (match) {
    return { color: match.color, textColor: match.textColor };
  } else {
    return { color: "white", textColor: "#000" };
  }
};

export const toggleSelectedTaste = (selected: string[], taste: string) => {
  if (selected.includes(taste)) {
    return selected.filter((val) => val !== taste);
  }
  return [...selected, taste];
};
