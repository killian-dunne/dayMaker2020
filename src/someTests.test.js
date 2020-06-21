// describe('time & Height function', () => {
//   test('converts a time and height offset to the new time', () => {
//     expect(convertHeightToTime('09:00', 5)).toBe('09:00');
//     expect(convertHeightToTime('10:00', -5)).toBe('09:45');
//   });
// });

import { isLater, cleanInput, handleAMPM, roundTime, timeDifferenceBetween } from './utils/dateStuff';
import { checkForOverlap, countActionsToShift, overlapActions } from './utils/actionOverlap';


describe('Testing isLater', () => {

  test('isLater(9am, 9am)', () => {
    expect(isLater('09:00', '09:00')[1]).toEqual(0)
  });

  test('isLater(10am, 9am)', () => {
    expect(isLater('10:00', '09:00')[1]).toEqual(1)
  })

  test('isLater(9:15am, 9am)', () => {
    expect(isLater('09:15', '09:00')[1]).toEqual(1)
  })
  test('isLater(12pm, 12pm)', () => {
    expect(isLater('12:00', '12:00')[1]).toEqual(0)
  })
  test('isLater(8am, 9am)', () => {
    expect(isLater('08:00', '09:00')[1]).toEqual(-1)
  })
  test('isLater(8:45am, 9am)', () => {
    expect(isLater('8:45', '09:00')[1]).toEqual(-1)
  })
  test('isLater(10pm, 9am)', () => {
    expect(isLater('22:00', '09:00')[1]).toEqual(1)
  })
  test('isLater(10am, 10pm)', () => {
    expect(isLater('10:00', '22:00')[1]).toEqual(-1)
  })

  test('isLater("10:00", "09:30")', () => {
    expect(isLater('10:00', '09:30')[1]).toEqual(1);
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

let actions = [{
  id: 'action0',
  data: {
    text: 'Hello there',
    times: {
      startTime: '09:00',
      endTime: '10:00'
    },
    completed: false
  },
},
{ id: 'action1',
  data: {
    text: 'Second action',
    times: {
      startTime: '09:30',
      endTime: '10:45'
    },
    completed: false
  },
},
{ id: 'action2',
  data: {
    text: 'Text, #3',
    times: {
      startTime: '11:15',
      endTime: '11:30'
    },
    completed: false
  }
},
{ id: 'action3',
  data: {
    text: 'Action number 4',
    times: {
      startTime: '18:00',
      endTime: '18:30'
    },
    completed: false
  },
},
{ id: 'action4',
  data: {
    text: 'Yet another, it`s 5',
    times: {
      startTime: '18:00',
      endTime: '18:45'
    },
    completed: false
  },
},
{ id: 'action5',
  data: {
    text: 'Keep going, #6',
    times: {
      startTime: '18:45',
      endTime: '19:00'
    },
    completed: false
  }
},
{ id: 'action6',
  data: {
    text: 'Nope, #7',
    times: {
      startTime: '19:30',
      endTime: '20:00'
    },
    completed: false
  }
}];

describe('Testing check for Overlap', () => {

  test('checkForOverlap("09:00", "10:00", actions)', () => {
    expect(checkForOverlap('09:00', '10:00', actions)).toEqual([0, 1]);
  });

  test('checkForOverlap("09:00", "09:30", actions)', () => {
    expect(checkForOverlap('09:00', '09:30', actions)).toEqual([0]);
  });

  test('checkForOverlap("10:00", "10:15", actions)', () => {
    expect(checkForOverlap('10:00', '10:15', actions)).toEqual([1]);
  });

  test('checkForOverlap("14:00", "15:00", actions)', () => {
    expect(checkForOverlap('14:00', '15:00', actions)).toEqual([]);
  });

  test('checkForOverlap("18:30", "18:45", actions)', () => {
    expect(checkForOverlap('18:30', '18:45', actions)).toEqual([4]);
  });

  test('checkForOverlap("21:00", "22:00", actions)', () => {
    expect(checkForOverlap('21:00', '22:00', actions)).toEqual([]);
  });
})

describe('Testing timeDifferenceBetween', () => {
  test('timeDifferenceBetween("09:00", "10:00")', () => {
    expect(timeDifferenceBetween("09:00", "10:00")).toEqual(60)
  })

  test('timeDifferenceBetween("09:00", "09:30")', () => {
    expect(timeDifferenceBetween("09:00", "09:30")).toEqual(30)
  })

  test('timeDifferenceBetween("10:00", "10:15")', () => {
    expect(timeDifferenceBetween("10:00", "10:15")).toEqual(15)
  })

  test('timeDifferenceBetween("09:00", "08:00")', () => {
    expect(timeDifferenceBetween("09:00", "08:00")).toEqual(-60)
  })

  test('timeDifferenceBetween("12:00", "14:30")', () => {
    expect(timeDifferenceBetween("12:00", "14:30")).toEqual(150)
  })

  test('timeDifferenceBetween("18:00", "18:00")', () => {
    expect(timeDifferenceBetween("18:00", "18:00")).toEqual(0)
  })

  test('timeDifferenceBetween("21:00", "10:00")', () => {
    expect(timeDifferenceBetween("21:00", "10:00")).toEqual((-11) * 60)
  })
})

describe('testing countActionsToShift', () => {
  test('countActionsToShift("10:00", 1, actions, 30)', () => {
    expect(countActionsToShift("10:00", 1, actions, 30)).toEqual(1)
  })

  test('countActionsToShift("09:15", 0, actions, 30)', () => {
    expect(countActionsToShift("09:15", 0, actions, 30)).toEqual(2)
  })

  test('countActionsToShift("18:15", 3, actions, 15)', () => {
    expect(countActionsToShift("18:15", 3, actions, 15)).toEqual(3)
  })

  test('countActionsToShift("10:00", 1, actions, 45)', () => {
    expect(countActionsToShift("10:00", 1, actions, 45)).toEqual(2)
  })

  test('countActionsToShift("18:15", 3, actions, 15)', () => {
    expect(countActionsToShift("18:15", 3, actions, 15)).toEqual(3)
  })

  test('countActionsToShift("18:15", 3, actions, 45)', () => {
    expect(countActionsToShift("18:15", 3, actions, 45)).toEqual(4)
  })
})

describe('Testing overlapActions', () => {
  test('overlapActions(actions)', () => {
    expect(overlapActions(actions)).toEqual(['action1', 'action4'])
  })

});
