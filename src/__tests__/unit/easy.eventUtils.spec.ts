import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';
import { createDate } from '../utils';

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const events: Event[] = [
      {
        id: '1',
        title: '이벤트 2 미팅',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '이벤트 2팀 회의',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-10-17',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '이벤트 2팀 회의실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const searchTerm = '이벤트 2';
    const currentDate = createDate('2024-10-16');

    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toHaveLength(3);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const events: Event[] = [
      {
        id: '0',
        title: '기존 회의',
        date: '2024-06-29',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '1',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 첫째 날
        date: '2024-06-30',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-07-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 마지막 날
        date: '2024-07-06',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '기존 회의',
        date: '2024-07-07',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const searchTerm = '회의실 B';
    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, searchTerm, currentDate, 'week');

    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2024-06-30');
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 첫째 날
        date: '2024-06-30',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-07-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 마지막 날
        date: '2024-07-06',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '기존 회의',
        date: '2024-07-07',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '5',
        title: '기존 회의',
        date: '2024-08-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const searchTerm = '회의실 B';
    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, searchTerm, currentDate, 'month');

    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2024-07-03');
    expect(result[result.length - 1].date).toBe('2024-07-07');
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const events: Event[] = [
      {
        id: '0',
        title: '기존 회의',
        date: '2024-06-29',
        startTime: '09:00',
        endTime: '10:00',
        description: '이벤트 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '1',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 첫째 날
        date: '2024-06-30',
        startTime: '09:00',
        endTime: '10:00',
        description: '이벤트 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-07-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '이벤트 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 마지막 날
        date: '2024-07-06',
        startTime: '09:00',
        endTime: '10:00',
        description: '이벤트 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '기존 회의',
        date: '2024-07-07',
        startTime: '09:00',
        endTime: '10:00',
        description: '이벤트 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const searchTerm = '이벤트';
    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, searchTerm, currentDate, 'week');

    console.log('result', result);

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2024-06-30',
          description: expect.stringContaining('이벤트'),
        }),
        expect.objectContaining({
          date: '2024-07-03',
          description: expect.stringContaining('이벤트'),
        }),
        expect.objectContaining({
          date: '2024-07-06',
          description: expect.stringContaining('이벤트'),
        }),
      ])
    );
  });

  it('검색어가 없고, 주간 뷰일 경우 2024-07-01 주의 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        // 2024-07-01가 속한 주의 첫째 날
        date: '2024-06-30',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-07-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '기존 회의',
        date: '2024-07-06',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, '', currentDate, 'week');

    expect(result).toHaveLength(events.length);
  });

  it('검색어가 없고, 월간 뷰일 경우 7월의 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-07-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '기존 회의',
        date: '2024-07-06',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '기존 회의',
        date: '2024-07-07',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '5',
        title: '기존 회의',
        date: '2024-07-31',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, '', currentDate, 'month');

    expect(result).toHaveLength(events.length);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '미팅',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 b',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-10-17',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const searchTerm = '회의실 b';
    const currentDate = createDate('2024-10-16');

    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toHaveLength(3);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        date: '2024-06-30',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '기존 회의',
        date: '2024-07-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '기존 회의',
        date: '2024-07-31',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '5',
        title: '기존 회의',
        date: '2024-08-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const searchTerm = '';
    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, searchTerm, currentDate, 'month');

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ date: '2024-07-01' }),
        expect.objectContaining({ date: '2024-07-15' }),
        expect.objectContaining({ date: '2024-07-31' }),
      ])
    );
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const events: Event[] = [];
    const searchTerm = '';
    const currentDate = createDate('2024-07-01');

    const result = getFilteredEvents(events, searchTerm, currentDate, 'month');

    expect(result).toEqual([]);
  });
});
