# 무료 운동 데이터 대조 도구

이 폴더는 LiftLog의 고정 카탈로그(363개)를 바꾸지 않고 외부 데이터셋과 대조합니다.

## 입력 파일

로컬에서 아래 파일을 내려받아 이 폴더에 둡니다. 외부 원본은 저장소에 커밋하지 않습니다.

- `free-exercise-db.json` — `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`
- `repdb-exercises.json` — `https://exercise-dataset.com/exercises.json`

## 실행

```powershell
node tools/exercise-audit/audit.js
```

생성 파일:

- `coverage-result.json` — 다음 단계에서 수동 승인 매핑을 만들 수 있는 구조화 결과
- `coverage-report.md` — 사람이 검토하기 위한 표

`exact`은 영문 운동명이 완전히 같은 경우만 뜻합니다. `review`는 이름, 운동군, 장비가 어느 정도 맞는 후보일 뿐이라서, 실제 사용 전 장비·자세·자극 부위를 검토해야 합니다. `unmatched`도 해당 데이터셋에 없다는 확정이 아니라 자동 후보를 충분히 찾지 못했다는 의미입니다.
