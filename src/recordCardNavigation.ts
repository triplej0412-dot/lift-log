// 운동 기록 카드의 빈 영역을 누르면 기존 수정 버튼을 실행한다.
// 버튼·입력 요소를 누를 때는 원래 동작(수정/삭제 등)을 그대로 유지한다.
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('button, a, input, select, textarea, label')) return;

    const card = target.closest('article');
    const editButton = card?.querySelector<HTMLButtonElement>('button[aria-label="수정"]');
    editButton?.click();
  });
}
