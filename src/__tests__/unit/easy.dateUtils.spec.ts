import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
  isLeapYear,
} from '../../utils/dateUtils';
import { EVENTS } from '../fixtures/events';
import { LEAP_YEARS, NO_LEAP_YEARS } from '../fixtures/leapYears';

/**
 * Date 객체 생성을 위한 헬퍼 함수
 * @param dateString YYYY-MM-DD 형태의 문자열
 */
const createDate = (dateString: string): Date => {
  const [year, month, date] = dateString.split('-').map(Number);
  return new Date(year, month - 1, date);
};

describe('isLeapYear', () => {
  test.each([
    { year: 1, expected: false, description: '1은 윤년이 아닙니다' },
    { year: 4, expected: true, description: '4는 윤년입니다' },
    { year: 100, expected: false, description: '100은 100으로 나누어떨어지므로 윤년이 아닙니다' },
    { year: 400, expected: true, description: '400은 400으로 나누어떨어지므로 윤년입니다' },
    { year: 1900, expected: false, description: '1900은 100으로 나누어떨어지므로 윤년이 아닙니다' },
    { year: 2000, expected: true, description: '2000은 400으로 나누어떨어지므로 윤년입니다' },
    {
      year: 2004,
      expected: true,
      description: '2004는 4로 나누어떨어지고 100으로 나누어떨어지지 않으므로 윤년입니다',
    },
    {
      year: 2008,
      expected: true,
      description: '2008은 4로 나누어떨어지고 100으로 나누어떨어지지 않으므로 윤년입니다',
    },
    {
      year: 2010,
      expected: false,
      description: '2010은 4로 나누어떨어지지 않으므로 윤년이 아닙니다',
    },
    {
      year: 2012,
      expected: true,
      description: '2012는 4로 나누어떨어지고 100으로 나누어떨어지지 않으므로 윤년입니다',
    },
    {
      year: 2024,
      expected: true,
      description: '2024는 4로 나누어떨어지고 100으로 나누어떨어지지 않으므로 윤년입니다',
    },
  ])('$description', ({ year, expected }) => {
    expect(isLeapYear(year)).toBe(expected);
  });
});

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    const year = new Date().getFullYear();

    expect(getDaysInMonth(year, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    const year = new Date().getFullYear();

    expect(getDaysInMonth(year, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    LEAP_YEARS.forEach((year) => {
      expect(isLeapYear(year)).toBe(true);
    });

    LEAP_YEARS.forEach((year) => {
      expect(getDaysInMonth(year, 2)).toBe(29);
    });
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    NO_LEAP_YEARS.forEach((year) => {
      expect(isLeapYear(year)).toBe(false);
    });

    NO_LEAP_YEARS.forEach((year) => {
      expect(getDaysInMonth(year, 2)).toBe(28);
    });
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    const year = new Date().getFullYear();

    expect(() => getDaysInMonth(year, -1)).toThrowError(/month/);
    expect(() => getDaysInMonth(year, 0)).toThrowError(/month/);
    expect(() => getDaysInMonth(year, 13)).toThrowError(/month/);
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    // 2024-10-02 수요일
    const date = createDate('2024-10-02');

    expect(getWeekDates(date)).toEqual([
      createDate('2024-09-29'),
      createDate('2024-09-30'),
      createDate('2024-10-01'),
      createDate('2024-10-02'),
      createDate('2024-10-03'),
      createDate('2024-10-04'),
      createDate('2024-10-05'),
    ]);
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    // 2024-09-30 월요일
    const date = createDate('2024-09-30');

    expect(getWeekDates(date)).toEqual([
      createDate('2024-09-29'),
      createDate('2024-09-30'),
      createDate('2024-10-01'),
      createDate('2024-10-02'),
      createDate('2024-10-03'),
      createDate('2024-10-04'),
      createDate('2024-10-05'),
    ]);
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = createDate('2024-09-29');

    expect(getWeekDates(date)).toEqual([
      createDate('2024-09-29'),
      createDate('2024-09-30'),
      createDate('2024-10-01'),
      createDate('2024-10-02'),
      createDate('2024-10-03'),
      createDate('2024-10-04'),
      createDate('2024-10-05'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = createDate('2024-12-31');

    expect(getWeekDates(date)).toEqual([
      createDate('2024-12-29'),
      createDate('2024-12-30'),
      createDate('2024-12-31'),
      createDate('2025-01-01'),
      createDate('2025-01-02'),
      createDate('2025-01-03'),
      createDate('2025-01-04'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = createDate('2025-01-01');

    expect(getWeekDates(date)).toEqual([
      createDate('2024-12-29'),
      createDate('2024-12-30'),
      createDate('2024-12-31'),
      createDate('2025-01-01'),
      createDate('2025-01-02'),
      createDate('2025-01-03'),
      createDate('2025-01-04'),
    ]);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const date = createDate('2024-02-29');

    // MEMO: 질문: 여기에 이 테스트 코드가 있는 것이 맞을까요?
    expect(isLeapYear(date.getFullYear())).toBe(true);

    expect(getWeekDates(date)).toEqual([
      createDate('2024-02-25'),
      createDate('2024-02-26'),
      createDate('2024-02-27'),
      createDate('2024-02-28'),
      createDate('2024-02-29'),
      createDate('2024-03-01'),
      createDate('2024-03-02'),
    ]);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = createDate('2024-10-31');

    expect(getWeekDates(date)).toEqual([
      createDate('2024-10-27'),
      createDate('2024-10-28'),
      createDate('2024-10-29'),
      createDate('2024-10-30'),
      createDate('2024-10-31'),
      createDate('2024-11-01'),
      createDate('2024-11-02'),
    ]);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const result = getWeeksAtMonth(createDate('2024-07-01'));

    expect(result).toEqual([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

// MEMO: 질문: eventUtils에 있는게 더 적절하지 않나요?
describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const result = getEventsForDay(EVENTS, 1);

    expect(result).toHaveLength(1);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(EVENTS, 2);

    expect(result).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(EVENTS, 0);

    expect(result).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(EVENTS, 32);

    expect(result).toEqual([]);
  });

  it('주어진 이벤트가 없을 경우 날짜와 상관없이 빈 배열을 반환한다', () => {
    const dates = [createDate('2024-10-01'), createDate('2024-10-02')];

    dates.forEach((date) => {
      const result = getEventsForDay([], date.getDate());

      expect(result).toEqual([]);
    });
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const date = createDate('2024-10-15');

    const result = formatWeek(date);

    expect(result).toBe('2024년 10월 3주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = createDate('2024-10-05');

    const result = formatWeek(date);

    expect(result).toBe('2024년 10월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = createDate('2024-10-31');

    const result = formatWeek(date);

    expect(result).toBe('2024년 10월 5주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    // 목요일이 1월인 경우
    expect(formatWeek(createDate('2024-12-31'))).toBe('2025년 1월 1주');

    // 목요일이 12월인 경우
    expect(formatWeek(createDate('2026-12-31'))).toBe('2026년 12월 5주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = createDate('2024-02-29');

    const result = formatWeek(date);

    expect(result).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = createDate('2023-02-28');

    const result = formatWeek(date);

    expect(result).toBe('2023년 3월 1주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    const date = createDate('2024-07-10');

    expect(formatMonth(date)).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = createDate('2024-07-01');
  const rangeEnd = createDate('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    const targetDate = createDate('2024-07-10');

    expect(isDateInRange(targetDate, rangeStart, rangeEnd)).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    const targetDate = createDate('2024-07-01');

    expect(isDateInRange(targetDate, rangeStart, rangeEnd)).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    const targetDate = createDate('2024-07-31');

    expect(isDateInRange(targetDate, rangeStart, rangeEnd)).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    const targetDate = createDate('2024-06-30');

    expect(isDateInRange(targetDate, rangeStart, rangeEnd)).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    const targetDate = createDate('2024-08-01');

    expect(isDateInRange(targetDate, rangeStart, rangeEnd)).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const dates = [createDate('2024-07-01'), createDate('2024-07-10'), createDate('2024-07-31')];

    dates.forEach((date) => {
      expect(isDateInRange(date, rangeEnd, rangeStart)).toBe(false);
    });
  });
});

describe('fillZero', () => {
  // TODO: test.each로 리팩토링
  it("5를 2자리로 변환하면 '05'를 반환한다", () => {
    expect(fillZero(5)).toBe('05');
    expect(fillZero(5, 2)).toBe('05');
  });

  it("10을 2자리로 변환하면 '10'을 반환한다", () => {
    expect(fillZero(10)).toBe('10');
  });

  it("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  it("100을 2자리로 변환하면 '100'을 반환한다", () => {
    expect(fillZero(100)).toBe('100');
  });

  it("0을 2자리로 변환하면 '00'을 반환한다", () => {
    expect(fillZero(0)).toBe('00');
  });

  it("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  it("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  it('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    // MEMO: 질문: vi.spnOn()을 이용해서 함수를 모킹하고, toHaveBeenCalledWith API를 이용해서
    // 파라미터와 함께 실행되었는지 검증해야 할까요?
    expect(fillZero(5)).toBe(fillZero(5, 2));
  });

  it('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    expect(fillZero(10000, 2)).toBe('10000');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const date = createDate('2024-10-01');

    expect(formatDate(date)).toBe('2024-10-01');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const date = createDate('2024-10-01');

    expect(formatDate(date, 17)).toBe('2024-10-17');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const date = createDate('2025-01-10');

    expect(formatDate(date)).toBe('2025-01-10');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const date = createDate('2024-11-01');

    expect(formatDate(date)).toBe('2024-11-01');
  });
});
