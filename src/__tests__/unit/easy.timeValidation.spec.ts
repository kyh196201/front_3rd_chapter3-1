import { getTimeErrorMessage } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    const result = getTimeErrorMessage('11:00', '10:00');

    expect(result.startTimeError).not.toBeNull();
    expect(result.endTimeError).not.toBeNull();
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    const result = getTimeErrorMessage('10:00', '10:00');

    expect(result.startTimeError).not.toBeNull();
    expect(result.endTimeError).not.toBeNull();

    // MEMO: 질문: 에러 문구는 추후 수정 될 여지가 많기 때문에 문자열을 직접 비교하지 않고,
    // null이 아닌지만 검증했습니다. 이렇게 테스트해도 괜찮을까요?
    // expect(result).toEqual({
    //   startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    //   endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    // });
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const result = getTimeErrorMessage('09:59', '10:00');

    expect(result).toEqual({
      startTimeError: null,
      endTimeError: null,
    });
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const result = getTimeErrorMessage('', '10:00');

    expect(result).toEqual({
      startTimeError: null,
      endTimeError: null,
    });
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const result = getTimeErrorMessage('10:00', '');

    expect(result).toEqual({
      startTimeError: null,
      endTimeError: null,
    });
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    const result = getTimeErrorMessage('', '');

    expect(result).toEqual({
      startTimeError: null,
      endTimeError: null,
    });
  });
});
