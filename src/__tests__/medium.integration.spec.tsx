import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { server } from '../setupTests';
import { Event } from '../types';
import { createDate } from './utils';

// ! HINT. 이 유틸을 사용해 리액트 컴포넌트를 렌더링해보세요.
const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user }; // ? Medium: 여기서 ChakraProvider로 묶어주는 동작은 의미있을까요? 있다면 어떤 의미일까요?
};

// ! HINT. 이 유틸을 사용해 일정을 저장해보세요.
const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'>
) => {
  const { title, date, startTime, endTime, location, description, category } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.selectOptions(screen.getByLabelText('카테고리'), category);

  await user.click(screen.getByTestId('event-submit-button'));
};

// ! HINT. "검색 결과가 없습니다"는 초기에 노출되는데요. 그럼 검증하고자 하는 액션이 실행되기 전에 검증해버리지 않을까요? 이 테스트를 신뢰성있게 만드려면 어떻게 할까요?
describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    expect(screen.queryByText('새 회의')).not.toBeInTheDocument();

    await saveSchedule(user, {
      title: '새 회의',
      date: '2024-10-01',
      startTime: '22:00',
      endTime: '23:30',
      description: '새 회의에요',
      location: '위치는 몰라요',
      category: '업무',
    });

    await waitFor(() => {
      // MEMO: calendar 영역에도 추가되기 때문에 2개의 요소가 검색되고, 테스트가 실패함
      // event-list 안에서 요소를 검색하기 위해서 within 사용
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('새 회의')).toBeInTheDocument();
    });
  });

  it.only('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    vi.setSystemTime(createDate('2024-10-15'));

    setupMockHandlerUpdating();

    const { user } = setup(<App />);

    const editButtons = await screen.findAllByLabelText('Edit event');

    // 1. 수정 버튼 클릭
    await user.click(editButtons[0]);

    // 2. 폼에 데이터 잘 반영되었는지 확인
    const titleInput = screen.getByLabelText('제목');
    expect(titleInput).toHaveValue('기존 회의');

    // 3. 제목 수정
    const newTitle = '새로운 회의';
    await user.clear(titleInput);

    // MEMO: user.clear()를 하지 않을 경우
    await user.type(titleInput, newTitle);

    const dateInput = screen.getByLabelText('날짜');
    const newDate = '2024-10-17';
    await user.clear(dateInput);
    await user.type(dateInput, newDate);

    // 4. 업데이트 실행
    await user.click(screen.getByTestId('event-submit-button'));

    // 5. 데이터 반영 확인
    expect(titleInput).toHaveValue('');

    await waitFor(() => {
      // MEMO: calendar 영역에도 추가되기 때문에 2개의 요소가 검색되고, 테스트가 실패함
      // event-list 안에서 요소를 검색하기 위해서 within 사용
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText(newTitle)).toBeInTheDocument();
      expect(within(eventList).getByText(newDate)).toBeInTheDocument();
    });
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
