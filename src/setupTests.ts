import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from './__mocks__/handlers';

/* msw */
export const server = setupServer(...handlers);

vi.stubEnv('TZ', 'UTC');

beforeAll(() => {
  server.listen();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

beforeEach(() => {
  // MEMO: 실행된 테스트 코드 안에서 적어도 하나의 어설션이 호출되었는지 확인
  // expect.hasAssertions()를 실행하지 않을 경우, 테스트 코드에 어설션이 없어도 테스트가 통과
  expect.hasAssertions();

  vi.setSystemTime(new Date('2024-10-01')); // ? Medium: 왜 이 시간을 설정해주는 걸까요?
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
  server.close();
});
