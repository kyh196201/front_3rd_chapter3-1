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
    const dates = ['2024-11-1', '2024-13-01'];
    const time = '14:30';

    dates.forEach((date) => {
      const result = parseDateTime(date, time);

      expect(result).toBeInstanceOf(Date);
      expect(isValidDate(result)).toBe(false);
    });
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-12-22', '24:01');

    expect(date).toBeInstanceOf(Date);
    expect(isValidDate(date)).toBe(false);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = parseDateTime('', '12:45');

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
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const event2: Event = {
      id: '2',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '16:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const event2: Event = {
      id: '2',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '15:00',
      endTime: '16:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    expect(isOverlapping(event1, event2)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const currentEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '15:00',
      endTime: '16:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '3',
      title: '새 회의',
      date: '2024-10-15',
      startTime: '15:10',
      endTime: '15:40',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const overlapping = findOverlappingEvents(newEvent, currentEvents);

    expect(overlapping).toHaveLength(1);
    expect(overlapping[0].id).toBe('2');
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '3',
      title: '새 회의',
      date: '2024-11-15',
      startTime: '15:10',
      endTime: '15:40',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const overlapping = findOverlappingEvents(newEvent, currentEvents);

    expect(overlapping).toHaveLength(0);
  });
});
