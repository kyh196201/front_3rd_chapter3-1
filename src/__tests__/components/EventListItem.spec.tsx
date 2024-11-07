import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { EventListItem, EventListItemProps } from '../../components/EventItem';
import { Event } from '../../types';

const mockEvent: Event = {
  id: '1',
  title: '팀 회의',
  date: '2024-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const renderComponentWithUser = (props?: Partial<EventListItemProps>) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ChakraProvider>
        <EventListItem
          event={mockEvent}
          isNotified={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          {...props}
        />
      </ChakraProvider>
    ),
    user,
  };
};

describe('EventListItem', () => {
  it('props로 전달받은 일정 정보를 렌더링한다.', () => {
    renderComponentWithUser();

    expect(screen.getByText('팀 회의')).toBeInTheDocument();
    expect(screen.getByText('2024-10-15')).toBeInTheDocument();
    expect(screen.getByText(/09:00/)).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
    expect(screen.getByText('주간 팀 미팅')).toBeInTheDocument();
    expect(screen.getByText('회의실 A')).toBeInTheDocument();
    expect(screen.getByText(/업무/)).toBeInTheDocument();
    expect(screen.getByText(/10분 전/)).toBeInTheDocument();
  });

  it('수정 버튼을 클릭하면 onEdit가 호출된다', async () => {
    const onEdit = vi.fn();
    const { user } = renderComponentWithUser({
      onEdit,
    });

    await user.click(screen.getByLabelText('Edit event'));

    expect(onEdit).toHaveBeenCalledWith(mockEvent);
  });

  it('삭제 버튼을 클릭하면 onDelete가 호출된다', async () => {
    const onDelete = vi.fn();
    const { user } = renderComponentWithUser({
      onDelete,
    });

    await user.click(screen.getByLabelText('Delete event'));

    expect(onDelete).toHaveBeenCalledWith(mockEvent.id);
  });
});
