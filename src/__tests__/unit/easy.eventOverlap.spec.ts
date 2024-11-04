import { Event } from '../../types';
import { isValidDate } from '../../utils/dateUtils';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';
import { EVENTS } from '../fixtures/events';

describe('parseDateTime', () => {
  // MEMO: 질문: 정확한 Date 객체라는 것이 어떤 뜻인지 잘 모르겠음
  // 유효한 Date 인지 확인하는 건가요?
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = parseDateTime('2024-07-01', '14:30');

    expect(date).toBeInstanceOf(Date);
    expect(isValidDate(date)).toBe(true);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(30);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-13-01', '14:30');

    expect(date).toBeInstanceOf(Date);
    expect(isValidDate(date)).toBe(false);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-12-22', '77:77');

    expect(date).toBeInstanceOf(Date);
    expect(isValidDate(date)).toBe(false);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = parseDateTime('', '77:77');

    expect(date).toBeInstanceOf(Date);
    expect(isValidDate(date)).toBe(false);
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const { start, end } = convertEventToDateRange(EVENTS[0]);

    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(isValidDate(start)).toBeTruthy();
    expect(isValidDate(end)).toBeTruthy();
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = {
      date: '2024-11-1',
      startTime: '10:00',
      endTime: '11:00',
    } as Event;

    const { start, end } = convertEventToDateRange(event);

    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(isValidDate(start)).toBeFalsy();
    expect(isValidDate(end)).toBeFalsy();
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = {
      date: '2024-11-01',
      startTime: '24:01',
      endTime: '25:00',
    } as Event;

    const { start, end } = convertEventToDateRange(event);

    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(isValidDate(start)).toBeFalsy();
    expect(isValidDate(end)).toBeFalsy();
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {});

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {});
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {});

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {});
});
