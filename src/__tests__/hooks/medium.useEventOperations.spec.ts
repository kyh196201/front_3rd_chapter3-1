import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { EventForm } from '../../types.ts';

// ? Medium: 아래 toastFn과 mock과 이 fn은 무엇을 해줄까요?
// A. ui가 없는 환경이기 때문에 toast가 렌더링되었는지 확인할 수 없습니다.
// 따라서, 실제 훅에서 호출하는 useToast를 모킹하여 테스트 환경에서 toastFn이 실행되게 만들고,
// toastFn 함수가 정상적으로 실행되고, 실행될 때 파라미터가 제대로 넘겨졌는지 확인할 수 있습니다.
const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  expect(result.current.events).toHaveLength(0);

  // MEMO: waitFor을 통해 비동기 로직이 완료되는 것을 기다릴 수 있음
  await waitFor(() => {
    // useEffect 내부의 비동기 로직이 호출된 이후에 실행
    expect(result.current.events).toHaveLength(1);
  });
});

describe('이벤트 등록', () => {
  beforeEach(() => {
    setupMockHandlerCreation([]);
  });

  const newEvent: EventForm = {
    title: '새로운 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '새로운 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  it('새로운 이벤트를 등록할 수 있다', async () => {
    const { result } = renderHook(() => useEventOperations(false));

    await waitFor(() => {
      expect(result.current.events).toHaveLength(0);
    });

    act(() => {
      result.current.saveEvent(newEvent);
    });

    await waitFor(() => {
      expect(result.current.events).toEqual([expect.objectContaining(newEvent)]);
      expect(toastFn).toHaveBeenCalledWith({
        title: '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  });

  it('`onSave` 콜백 함수가 있으면 이벤트 등록이 완료된 후 콜백 함수를 호출합니다', async () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useEventOperations(false, onSave));

    act(() => {
      result.current.saveEvent(newEvent);
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});

describe('이벤트 수정', () => {
  beforeEach(() => {
    setupMockHandlerUpdating();
  });

  it('기존에 등록된 이벤트를 수정할 수 있습니다.', async () => {
    const { result } = renderHook(() => useEventOperations(true));

    await waitFor(() => {
      expect(result.current.events).toHaveLength(2);
      expect(result.current.events[0]).toEqual(
        expect.objectContaining({
          id: '1',
          title: '기존 회의',
          startTime: '09:00',
          endTime: '10:00',
        })
      );
    });

    const eventToUpdate = result.current.events[0];

    act(() => {
      result.current.saveEvent({
        ...eventToUpdate,
        title: '새로운 타이틀',
        startTime: '11:00',
        endTime: '12:00',
      });
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(2);
      expect(result.current.events[0]).toEqual({
        ...eventToUpdate,
        title: '새로운 타이틀',
        startTime: '11:00',
        endTime: '12:00',
      });

      expect(toastFn).toHaveBeenCalledWith({
        title: '일정이 수정되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  });

  it('`onSave` 콜백 함수가 있으면 이벤트 수정이 완료된 후 콜백 함수를 호출합니다', async () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useEventOperations(true, onSave));

    await waitFor(() => {
      expect(result.current.events).toHaveLength(2);
    });

    const eventToUpdate = result.current.events[0];

    act(() => {
      result.current.saveEvent({
        ...eventToUpdate,
        title: '새로운 타이틀',
        startTime: '11:00',
        endTime: '12:00',
      });
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  setupMockHandlerDeletion();

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toHaveLength(1);
  });

  const eventToDelete = result.current.events[0];

  act(() => {
    result.current.deleteEvent(eventToDelete.id);
  });

  await waitFor(() => {
    expect(result.current.events).toHaveLength(0);

    expect(toastFn).toHaveBeenCalledWith({
      title: '일정이 삭제되었습니다.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toEqual([]);

    expect(toastFn).toHaveBeenCalledWith({
      title: '이벤트 로딩 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(true));

  await waitFor(() => {
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0]).toEqual(
      expect.objectContaining({
        id: '1',
      })
    );
  });

  act(() => {
    result.current.saveEvent({
      id: '2',
      title: '존재하지 않는 일정',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    });
  });

  await waitFor(() => {
    expect(result.current.events).toHaveLength(1);

    expect(toastFn).toHaveBeenCalledWith({
      title: '일정 저장 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  server.use(
    http.delete('/api/events/:id', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  act(() => {
    result.current.deleteEvent('존재하지 않는 id');
  });

  await waitFor(() => {
    expect(toastFn).toHaveBeenCalledWith({
      title: '일정 삭제 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});
