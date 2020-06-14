// describe('time & Height function', () => {
//   test('converts a time and height offset to the new time', () => {
//     expect(convertHeightToTime('09:00', 5)).toBe('09:00');
//     expect(convertHeightToTime('10:00', -5)).toBe('09:45');
//   });
// });

import { isLater, cleanInput, handleAMPM, roundTime } from './utils/dateStuff';

describe('Testing isLater', () => {

  test('isLater(9am, 9am)', () => {
    expect(isLater('09:00', '09:00')[1]).toEqual(true)
  });

  test('isLater(10am, 9am)', () => {
    expect(isLater('10:00', '09:00')[1]).toEqual(true)
  })

  test('isLater(9:15am, 9am)', () => {
    expect(isLater('09:15', '09:00')[1]).toEqual(true)
  })
  test('isLater(12pm, 12pm)', () => {
    expect(isLater('12:00', '12:00')[1]).toEqual(true)
  })
  test('isLater(8am, 9am)', () => {
    expect(isLater('08:00', '09:00')[1]).toEqual(false)
  })
  test('isLater(8:45am, 9am)', () => {
    expect(isLater('8:45', '09:00')[1]).toEqual(false)
  })
  test('isLater(10pm, 9am)', () => {
    expect(isLater('22:00', '09:00')[1]).toEqual(true)
  })
  test('isLater(10am, 10pm)', () => {
    expect(isLater('10:00', '22:00')[1]).toEqual(false)
  })

});

describe('handleAMPM tests', () => {
  test('hanldeAMPM(9am)', () => {
    expect(handleAMPM('9am')).toEqual(['9', null])
  });

  test('hanldeAMPM(1030pm)', () => {
    expect(handleAMPM('1030pm')).toEqual(['1030', true])
  });
})

describe('Testing cleanInput', () => {
  test('cleanInput(9am)', () => {
    expect(cleanInput('9am')).toEqual(['09:00', false]);
  });

  test('cleanInput(9pm)', () => {
    expect(cleanInput('9pm')).toEqual(['21:00', false]);
  });

  test('cleanInput(12am)', () => {
    expect(cleanInput('12am')).toEqual(['12:00', false]);
  });

  test('cleanInput(10pm)', () => {
    expect(cleanInput('10pm')).toEqual(['22:00', false]);
  });

  test('cleanInput(1030pm)', () => {
    debugger;
    expect(cleanInput('1030pm')).toEqual(['22:30', false]);
  });

  test('cleanInput(1130pm)', () => {
    expect(cleanInput('1130pm')).toEqual(['23:30', false]);
  });

  test('cleanInput(15:00)', () => {
    expect(cleanInput('15:00')).toEqual(['15:00', false]);
  });

  test('cleanInput(12:30)', () => {
    expect(cleanInput('12:30')).toEqual(['12:30', false]);
  });

  test('cleanInput(1415)', () => {
    expect(cleanInput('1415')).toEqual(['14:15', false]);
  });

  test('cleanInput(1845)', () => {
    expect(cleanInput('1845')).toEqual(['18:45', false]);
  });

  test('cleanInput(1917)', () => {
    expect(cleanInput('1917')).toEqual(['19:15', false]);
  });

  test('cleanInput(1212)', () => {
    expect(cleanInput('1212')).toEqual(['12:15', false]);
  });

  test('cleanInput(1258am)', () => {
    expect(cleanInput('1258am')).toEqual(['01:00', false]);
  });

  test('cleanInput()', () => {
    expect(cleanInput('')).toEqual(['Time missing', true]);
  });

  test('cleanInput( )', () => {
    expect(cleanInput(' ')).toEqual(['Time missing', true]);
  });

});

describe('roundTime tests', () => {
  test('roundTime(9, 0)', () => {
    expect(roundTime(9, 0)).toEqual([9, 0])
  });

  test('roundTime(22, 30)', () => {
    expect(roundTime(22, 30)).toEqual([22, 30])
  });
})
