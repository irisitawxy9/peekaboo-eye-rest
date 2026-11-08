// Settings and animal list shared by the popup, the card and the background.

const PEEKABOO_DEFAULTS = {
  enabled: true,
  intervalMinutes: 20, // how often the animal appears
  restSeconds: 20,     // how long the rest countdown lasts
  corner: "bottom-right",
  animals: ["cat", "bunny", "otter"],
  giphyKey: "" // paste your free GIPHY key in the popup (or here)
};

// id -> label shown in the popup, and the GIPHY search used for it
const PEEKABOO_ANIMALS = [
  { id: "cat", label: "Cats", search: "cute kitten" },
  { id: "dog", label: "Puppies", search: "cute puppy" },
  { id: "bunny", label: "Bunnies", search: "cute bunny" },
  { id: "panda", label: "Pandas", search: "baby panda" },
  { id: "otter", label: "Otters", search: "cute otter" },
  { id: "redpanda", label: "Red pandas", search: "red panda" },
  { id: "hamster", label: "Hamsters", search: "cute hamster" },
  { id: "penguin", label: "Penguins", search: "cute penguin" }
];
