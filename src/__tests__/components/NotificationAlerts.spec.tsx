import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';

import { NotificationAlerts } from '../../components/NotificationAlerts';

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user };
};

describe('NotificationAlerts', () => {
  const mockNotifications = [
    { id: '1', message: 'Test notification 1' },
    { id: '2', message: '10분 후 회의가 시작됩니다.' },
  ];

  it('notifications이 비어있으면 알림이 나타나지 않는다', () => {
    setup(<NotificationAlerts notifications={[]} onRemove={() => {}} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('notifications이 있을 경우 화면에 알림이 나타난다.', () => {
    setup(<NotificationAlerts notifications={mockNotifications} onRemove={() => {}} />);

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText('Test notification 1')).toBeInTheDocument();
    expect(screen.getByText('10분 후 회의가 시작됩니다.')).toBeInTheDocument();
  });

  it('닫기 버튼을 클릭하면 onRemove가 호출된다', async () => {
    const onRemove = vi.fn();
    const { user } = setup(
      <NotificationAlerts notifications={mockNotifications} onRemove={onRemove} />
    );

    const closeButtons = screen.getAllByRole('button');
    await user.click(closeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith(0);
  });
});
