import { Alert, AlertIcon, AlertTitle, Box, CloseButton, VStack } from '@chakra-ui/react';

interface Notification {
  id: string;
  message: string;
}

interface Props {
  notifications: Notification[];
  // eslint-disable-next-line no-unused-vars
  onRemove: (index: number) => void;
}

export const NotificationAlerts = ({ notifications, onRemove }: Props) => {
  if (notifications.length === 0) return null;

  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <Alert key={index} status="info" variant="solid" width="auto">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
          </Box>
          <CloseButton onClick={() => onRemove(index)} />
        </Alert>
      ))}
    </VStack>
  );
};
