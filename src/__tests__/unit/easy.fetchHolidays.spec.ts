import { fetchHolidays } from '../../apis/fetchHolidays';
import { createDate } from '../utils';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const result = fetchHolidays(createDate('2024-10-01'));

    expect(result).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const result = fetchHolidays(createDate('2024-11-01'));

    expect(result).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const result = fetchHolidays(createDate('2024-09-01'));

    expect(result).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });
  });
});
