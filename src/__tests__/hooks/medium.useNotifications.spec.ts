import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';

it('일정이 없을 경우 알림이 없어야 한다', () => {
  const { result } = renderHook(() => useNotifications([]));

  expect(result.current.notifications).toHaveLength(0);
});

it('1초 마다 알림 시간이 도래한 이벤트에 대한 알림이 새롭게 생성되어 추가된다', () => {
  vi.setSystemTime(new Date('2024-10-15T08:55'));

  const events: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  const { result } = renderHook(() => useNotifications(events));

  expect(result.current.notifications).toEqual([]);

  act(() => {
    vi.advanceTimersByTime(500);
  });

  expect(result.current.notifications).toEqual([]);

  // When testing, code that causes React state updates should be wrapped into act
  // MEMO: interval에서 리액트 상태를 변경하기 떄문에 act로 감싸야된다.
  act(() => {
    vi.advanceTimersByTime(500);
  });

  expect(result.current.notifications).toHaveLength(1);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const { result } = renderHook(() => useNotifications([]));

  const notifications = [
    {
      id: '1',
      message: '',
    },
    {
      id: '2',
      message: '',
    },
  ];

  act(() => {
    result.current.setNotifications(notifications);
  });

  expect(result.current.notifications).toHaveLength(2);

  act(() => {
    result.current.removeNotification(0);
  });

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifications[0]).toEqual(notifications[1]);
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  vi.setSystemTime(new Date('2024-10-15T08:55'));

  const events: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  const { result } = renderHook(() => useNotifications(events));

  expect(result.current.notifications).toEqual([]);

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifications).toEqual([expect.objectContaining({ id: events[0]['id'] })]);
  expect(result.current.notifiedEvents).toHaveLength(1);
  expect(result.current.notifiedEvents).toContain(events[0]['id']);

  act(() => {
    vi.advanceTimersByTime(2000);
  });

  expect(result.current.notifications).toHaveLength(1);
});
