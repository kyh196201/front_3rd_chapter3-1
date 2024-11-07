import { BellIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';

import { Event } from '../types';

interface Props {
  event: Event;
  isNotified: boolean;
  // eslint-disable-next-line no-unused-vars
  onEdit: (event: Event) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
}

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

export const EventListItem = ({ event, isNotified, onEdit, onDelete }: Props) => {
  const getRepeatText = () => {
    if (event.repeat.type === 'none') return null;

    const intervalUnit =
      event.repeat.type === 'daily'
        ? '일'
        : event.repeat.type === 'weekly'
          ? '주'
          : event.repeat.type === 'monthly'
            ? '월'
            : '년';

    return `반복: ${event.repeat.interval}${intervalUnit}마다${
      event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
    }`;
  };

  return (
    <Box data-testid="event-list-item" borderWidth={1} borderRadius="lg" p={3} width="100%">
      <HStack justifyContent="space-between">
        <VStack align="start">
          <HStack>
            {isNotified && <BellIcon color="red.500" data-testid="notification-icon" />}
            <Text
              fontWeight={isNotified ? 'bold' : 'normal'}
              color={isNotified ? 'red.500' : 'inherit'}
            >
              {event.title}
            </Text>
          </HStack>
          <Text>{event.date}</Text>
          <Text>
            {event.startTime} - {event.endTime}
          </Text>
          <Text>{event.description}</Text>
          <Text>{event.location}</Text>
          <Text>카테고리: {event.category}</Text>
          {event.repeat.type !== 'none' && <Text>{getRepeatText()}</Text>}
          <Text>
            알림:{' '}
            {notificationOptions.find((option) => option.value === event.notificationTime)?.label}
          </Text>
        </VStack>
        <HStack>
          <IconButton aria-label="Edit event" icon={<EditIcon />} onClick={() => onEdit(event)} />
          <IconButton
            aria-label="Delete event"
            icon={<DeleteIcon />}
            onClick={() => onDelete(event.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export type { Props as EventListItemProps };
