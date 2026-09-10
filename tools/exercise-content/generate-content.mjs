/**
 * Generates LiftLog's Korean exercise-detail database from the fixed catalog.
 * The catalog is never changed; each record is keyed by its existing presetId.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/friend_exercise_catalog_v1.json'), 'utf8'));
const similarReferenceIds = new Set([
  'chest_band_chest_fly', 'chest_plate_squeeze_press', 'back_machine_pullover',
  'back_dumbbell_kroc_row', 'back_barbell_yates_row', 'back_barbell_landmine_row',
  'back_band_row', 'back_plate_loaded_row', 'legs_band_lateral_walk', 'legs_bodyweight_step_up',
  'shoulders_machine_plate_loaded_shoulder_press', 'shoulders_bodyweight_prone_y_raise',
  'arms_other_gripper', 'arms_machine_assisted_dip', 'abs_barbell_landmine_rotation',
  'abs_cable_woodchop', 'abs_plate_side_bend', 'abs_bodyweight_toe_touch',
  'abs_band_crunch', 'wall_tibialis_raise', 'hanging_windshield_wiper',
]);

function equipment(preset) {
  const value = preset.equipmentNameKo;
  return value || ({ bodyweight: '맨몸', dumbbell: '덤벨', barbell: '바벨', cable: '케이블', machine: '머신', band: '밴드', kettlebell: '케틀벨', plate: '플레이트', smith: '스미스 머신', other: '기타 장비' }[preset.equipmentVariantId] || '운동 장비');
}
function motion(name) {
  if (/스쿼트|런지|스텝업|레그 프레스|레그 익스텐션|컬|노르딕|월 싯|리버스 노르딕/.test(name)) return ['하체를 안정적으로 지지한 뒤 무릎과 발끝의 방향을 맞춥니다.', '발바닥 전체로 바닥을 밀며 무릎이 안쪽으로 무너지지 않게 동작합니다.', '허리의 중립을 유지하고 반동 없이 가동 범위를 조절합니다.'];
  if (/로우|풀업|친업|풀다운|풀오버|페이스 풀|풀어파트|백 익스텐션/.test(name)) return ['몸통을 단단히 고정하고 어깨를 귀에서 멀리 둡니다.', '팔보다 등과 견갑의 움직임으로 당기고, 팔꿈치를 목표 방향으로 보냅니다.', '끝 지점에서 어깨가 과하게 올라가지 않도록 천천히 시작 자세로 돌아옵니다.'];
  if (/프레스|푸쉬업|딥스|JM 프레스|핸드스탠드|파이크/.test(name)) return ['손잡이 또는 바닥을 단단히 지지하고 손목·어깨를 안정시킵니다.', '몸통을 고정한 채 목표 방향으로 밀고, 팔꿈치 궤적을 일정하게 유지합니다.', '관절을 강하게 잠그지 말고 통제된 속도로 시작 자세로 돌아옵니다.'];
  if (/플라이|레이즈|슈러그|업라이트 로우|하이 풀|쿠반/.test(name)) return ['가벼운 중량으로 시작해 몸통의 흔들림을 먼저 없앱니다.', '반동 대신 목표 근육이 수축되는 범위까지만 부드럽게 움직입니다.', '목과 어깨에 힘이 몰리지 않게 천천히 내려옵니다.'];
  if (/컬|리스트|그리퍼|행|캐리|핀치/.test(name)) return ['손목을 중립에 가깝게 두고 그립을 먼저 안정시킵니다.', '팔꿈치나 손목의 위치를 고정한 채 목표 관절만 천천히 움직입니다.', '통증이나 저림이 느껴지면 즉시 범위와 저항을 줄입니다.'];
  if (/플랭크|크런치|싯업|레그 레이즈|V업|러시안|회전|우드찹|사이드 벤드|윈드실드|데드 버그|할로우|롤아웃|팔로프|버드 독|드래곤/.test(name)) return ['골반과 갈비뼈를 정렬하고 허리가 과하게 뜨거나 꺾이지 않게 준비합니다.', '복부의 긴장을 유지한 채 천천히 움직이며, 팔·다리의 반동을 쓰지 않습니다.', '호흡을 멈추지 말고 통제 가능한 범위에서 시작 자세로 돌아옵니다.'];
  if (/데드리프트|굿모닝|스윙|힙 쓰러스트|글루트 브리지|풀스루|킥백|하이퍼/.test(name)) return ['발과 골반을 안정적으로 두고 척추를 중립으로 준비합니다.', '허리를 접기보다 엉덩이 관절에서 움직이며 둔근과 햄스트링의 긴장을 느낍니다.', '정점에서 허리를 과신전하지 말고 통제된 속도로 돌아옵니다.'];
  if (/클린|스내치|점프|머슬업|터키시|윈드밀/.test(name)) return ['가벼운 저항으로 동작 순서와 주변 공간을 먼저 확인합니다.', '각 구간을 급하게 넘기지 말고 몸통의 균형과 관절 정렬을 유지합니다.', '피로로 자세가 흐트러지면 반복을 멈추고 휴식합니다.'];
  return ['장비와 주변 공간을 확인하고 안정적인 시작 자세를 만듭니다.', '목표 근육의 긴장을 느끼며 반동 없이 통제된 범위로 움직입니다.', '관절 정렬을 유지한 채 천천히 시작 자세로 돌아옵니다.'];
}
function cue(name) {
  if (/스쿼트|런지|스텝업/.test(name)) return '무릎은 발끝과 같은 방향으로 움직입니다.';
  if (/로우|풀업|풀다운/.test(name)) return '팔꿈치보다 견갑을 먼저 안정시킨 뒤 당깁니다.';
  if (/프레스|푸쉬업|딥스/.test(name)) return '갈비뼈를 과하게 들지 말고 몸통 압력을 유지합니다.';
  if (/크런치|플랭크|레그 레이즈|회전|우드찹/.test(name)) return '복부를 단단히 조여 허리의 움직임을 최소화합니다.';
  return '반동을 줄이고, 통제 가능한 중량과 가동 범위를 우선합니다.';
}
function cautions(name) {
  const common = ['날카로운 통증, 저림 또는 어지러움이 있으면 즉시 중단합니다.', '피로로 자세를 유지할 수 없으면 중량·반복 수·가동 범위를 줄입니다.'];
  if (/데드리프트|굿모닝|스쿼트|로우|힙 쓰러스트/.test(name)) return ['허리를 둥글게 말거나 과하게 꺾지 않습니다.', ...common];
  if (/프레스|딥스|푸쉬업|레이즈|풀업/.test(name)) return ['어깨 앞쪽 통증이 나면 깊이와 그립·팔꿈치 궤적을 조절합니다.', ...common];
  if (/크런치|싯업|레그 레이즈|회전|우드찹/.test(name)) return ['목을 손으로 당기거나 허리의 반동으로 반복하지 않습니다.', ...common];
  return common;
}

const exercises = catalog.presets.map((preset) => {
  const name = preset.nameKo || preset.nameEn;
  const similar = similarReferenceIds.has(preset.presetId);
  return {
    presetId: preset.presetId,
    titleKo: name,
    primaryMuscles: [preset.primarySubPartNameKo || preset.defaultUiPart],
    secondaryMuscles: preset.secondarySubPartNamesKo || [],
    equipment: equipment(preset),
    setup: `${equipment(preset)}을(를) 사용해 ${name}을(를) 수행할 수 있는 안정적인 자세를 만듭니다.`,
    steps: motion(name),
    keyCue: cue(name),
    cautions: cautions(name),
    referenceNotice: similar ? '참고 동작입니다. 장비, 그립, 각도 또는 가동 범위가 현재 선택한 운동과 다를 수 있으니, 표시된 차이와 실제 운동 환경을 확인하세요.' : null,
    source: 'LiftLog 편집 초안 v1',
  };
});
const result = {
  format: 'liftlog.exercise-content',
  formatVersion: 1,
  generatedFrom: 'friend_exercise_catalog_v1.json',
  contentStyle: 'quick-check-v1',
  exercises,
};
for (const file of [path.join(root, 'src', 'exercise_content_v1.json'), path.join(root, 'android', 'app', 'src', 'main', 'assets', 'exercise_content_v1.json')]) {
  fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
}
console.log(`Generated ${exercises.length} exercise content records.`);
