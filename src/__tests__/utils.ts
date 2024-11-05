import { fillZero } from '../utils/dateUtils';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

/**
 * Date 객체 생성을 위한 헬퍼 함수
 * @param dateString YYYY-MM-DD 형태의 문자열
 */
export const createDate = (dateString: string): Date => {
  const [year, month, date] = dateString.split('-').map(Number);
  return new Date(year, month - 1, date);
};
