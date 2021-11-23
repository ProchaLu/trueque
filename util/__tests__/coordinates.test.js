const latSum = (userLat, myUserLat) => {
  return (userLat + myUserLat) / 2;
};

const lngSum = (userLng, myUserLng) => {
  return (userLng + myUserLng) / 2;
};

test('Should calculate the latitude for the middleWayPoint', () => {
  expect(latSum(48.19327, 48.20273)).toBe(48.198);
});

test('Should calculate the latitude for the middleWayPoint', () => {
  expect(lngSum(16.40898, 16.3838)).toBe(16.39639);
});

test('Should calculate the latitude for the middleWayPoint', () => {
  expect(latSum(47.80949, 48.208176)).toBe(48.008832999999996);
});

test('Should calculate the latitude for the middleWayPoint', () => {
  expect(lngSum(13.05501, 16.373819)).toBe(14.7144145);
});
