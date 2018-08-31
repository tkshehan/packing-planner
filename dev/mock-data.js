const listsData = [
  {
    name: "Camping",
    amount: 4,
    packedAmount: 1,
    id: 1,
  },
  {
    name: "Beach Trip",
    amount: 10,
    packedAmount: 9,
    id: 2,
  },
  {
    name: "Family Reunion",
    amount: 15,
    packedAmount: 15,
    id: 3,
  }
];

const packingData = {
  id: 1,
  name: "Camping",
  items: [
    {
      name: "First Aid Kit",
      packed: 0,
      toPack: 1
    },
    {
      name: "Tent",
      packed: 1,
      toPack: 1,
    },
    {
      name: "Sleeping Bags",
      packed: 0,
      toPack: 2,
    },
    {
      name: "Change of Clothes",
      packed: 1,
      toPack: 2,
    }
  ]
};

const templates = {
  'None': [],
  'Beach': [
    'towel',
    'sunscreen',
    'cooler', 'water',
    'sunglasses',
    'swimsuit',
  ],
  'Camping': [
    'tent',
    'bug-spray',
    'sleeping-bag',
    'flash-light',
    'fire-starter',
    'toiletries',
    'food',
    'first-aid kit',
  ],
}

module.exports = {listsData, packingData, templates};