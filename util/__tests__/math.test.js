const priceMin = (itemPrice, priceRange) => {
  return Math.floor(itemPrice - (itemPrice * priceRange) / 100);
};

const priceMax = (itemPrice, priceRange) => {
  return Math.ceil(itemPrice + (itemPrice * priceRange) / 100);
};

test('Should calculate the min sum for Item Range', () => {
  expect(priceMin(100, 10)).toBe(90);
});

test('Should calculate the min sum for Item Range', () => {
  expect(priceMin(100, 100)).toBe(0);
});

test('Should calculate the min sum for Item Range', () => {
  expect(priceMin(21, 10)).toBe(18);
});

test('Should calculate the min sum for Item Range', () => {
  expect(priceMax(100, 10)).toBe(110);
});

test('Should calculate the min sum for Item Range', () => {
  expect(priceMax(100, 100)).toBe(200);
});

test('Should calculate the min sum for Item Range', () => {
  expect(priceMax(21, 10)).toBe(24);
});
