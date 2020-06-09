// describe('time & Height function', () => {
//   test('converts a time and height offset to the new time', () => {
//     expect(convertHeightToTime('09:00', 5)).toBe('09:00');
//     expect(convertHeightToTime('10:00', -5)).toBe('09:45');
//   });
// });

describe('Examining the syntax of Jest tests', () => {

  it('sums numbers', () => {
      expect(1 + 2).toEqual(3);
      expect(2 + 2).toEqual(4);
   });
});

describe('First React component test with Enzyme', () => {
  it('renders without crashing', () => {
    shallow(<App/>);
  })
})
