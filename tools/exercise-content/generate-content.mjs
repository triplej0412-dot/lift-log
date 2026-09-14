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
  if (/스쿼트|런지|스텝업|레그 프레스|레그 익스텐션|컬|노르딕|월 싯|리버스 노르딕/.test(name)) return ['발바닥을 고정하고 무릎과 발끝 방향을 맞춥니다.', '엉덩이와 무릎을 함께 접었다가 바닥을 밀어 돌아옵니다.', '허리를 중립으로 두고 반동을 쓰지 않습니다.'];
  if (/로우|풀업|친업|풀다운|풀오버|페이스 풀|풀어파트|백 익스텐션/.test(name)) return ['몸통을 고정하고 어깨를 낮춥니다.', '팔꿈치를 목표 방향으로 당기며 등을 수축합니다.', '천천히 시작 자세로 돌아옵니다.'];
  if (/프레스|푸쉬업|딥스|JM 프레스|핸드스탠드|파이크/.test(name)) return ['손목과 어깨를 안정적으로 고정합니다.', '몸통을 유지하며 목표 방향으로 밉니다.', '관절을 잠그지 말고 천천히 돌아옵니다.'];
  if (/플라이|레이즈|슈러그|업라이트 로우|하이 풀|쿠반/.test(name)) return ['가벼운 중량으로 몸통을 고정합니다.', '반동 없이 목표 근육이 수축되는 만큼 올립니다.', '목과 어깨 힘을 빼고 천천히 내립니다.'];
  if (/컬|리스트|그리퍼|행|캐리|핀치/.test(name)) return ['손목과 그립을 안정시킵니다.', '팔꿈치나 손목 위치를 고정하고 움직입니다.', '통증이나 저림이 있으면 저항을 줄입니다.'];
  if (/플랭크|크런치|싯업|레그 레이즈|V업|러시안|회전|우드찹|사이드 벤드|윈드실드|데드 버그|할로우|롤아웃|팔로프|버드 독|드래곤/.test(name)) return ['골반과 갈비뼈를 정렬합니다.', '복부 긴장을 유지하며 천천히 움직입니다.', '호흡을 멈추지 말고 통제 범위를 지킵니다.'];
  if (/데드리프트|굿모닝|스윙|힙 쓰러스트|글루트 브리지|풀스루|킥백|하이퍼/.test(name)) return ['발과 골반을 안정시키고 척추를 중립으로 둡니다.', '엉덩이 관절에서 움직이며 둔근을 수축합니다.', '허리를 과신전하지 말고 돌아옵니다.'];
  if (/클린|스내치|점프|머슬업|터키시|윈드밀/.test(name)) return ['가벼운 저항으로 순서와 공간을 확인합니다.', '균형과 관절 정렬을 유지하며 움직입니다.', '자세가 흐트러지면 멈추고 쉽니다.'];
  return ['장비와 공간을 확인하고 시작 자세를 잡습니다.', '목표 근육에 집중하며 반동 없이 움직입니다.', '정렬을 유지하고 천천히 돌아옵니다.'];
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
    setup: `${equipment(preset)}을 준비하고 시작 자세를 잡습니다.`,
    steps: motion(name),
    keyCue: cue(name),
    cautions: cautions(name),
    referenceNotice: similar ? '참고 동작입니다. 장비·그립·각도가 다를 수 있습니다.' : null,
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
