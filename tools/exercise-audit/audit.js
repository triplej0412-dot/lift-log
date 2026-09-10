/*
 * Offline coverage audit for LiftLog's fixed exercise catalog.
 *
 * Usage (after downloading the two source files described in README.md):
 *   node tools/exercise-audit/audit.js
 *
 * This intentionally does not modify the catalog.  "review" means a textual
 * candidate was found, not that its technique/equipment is an approved match.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const input = (name) => path.join(__dirname, name);
const output = (name) => path.join(__dirname, name);

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src', 'friend_exercise_catalog_v1.json'), 'utf8'));
const freeDb = JSON.parse(fs.readFileSync(input('free-exercise-db.json'), 'utf8'));
const repDbDocument = JSON.parse(fs.readFileSync(input('repdb-exercises.json'), 'utf8'));
const repDb = repDbDocument.exercises;

const replacements = [
  [/push[ -]?up/g, 'pushup'], [/pull[ -]?up/g, 'pullup'], [/chin[ -]?up/g, 'chinup'],
  [/dumbell/g, 'dumbbell'], [/db\b/g, 'dumbbell'], [/bar bell/g, 'barbell'],
  [/kettle bell/g, 'kettlebell'], [/body ?weight|body ?only/g, 'bodyweight'],
  [/tricep extension/g, 'triceps extension'], [/hamstring curl/g, 'leg curl'],
  [/lat pulldown/g, 'lat pulldown'], [/romanian deadlift/g, 'rdl'],
  [/rear delt/g, 'rear deltoid'], [/side lateral raise/g, 'lateral raise'],
];
const stopWords = new Set(['exercise', 'with', 'the', 'and', 'of', 'on', 'a', 'an', 'for', 'to']);
const equipmentTokens = new Set(['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'band', 'kettlebell', 'smith', 'ez', 'lever', 'plate']);
const movementTokens = new Set(['press', 'curl', 'row', 'fly', 'raise', 'pullup', 'chinup', 'pushup', 'squat', 'deadlift', 'lunge', 'dip', 'pulldown', 'extension', 'crunch', 'plank', 'shrug', 'calf', 'hip', 'abduction', 'adduction', 'leg', 'back', 'reverse', 'front', 'incline', 'decline', 'seated', 'standing', 'lying', 'bench', 'crossover', 'kickback', 'drag', 'skullcrusher']);

function normalise(value) {
  let text = String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  for (const [pattern, replacement] of replacements) text = text.replace(pattern, replacement);
  return text.replace(/\s+/g, ' ').trim();
}
function tokens(value) {
  return [...new Set(normalise(value).split(' ').filter((token) => token && !stopWords.has(token)))];
}
function candidateNames(preset) {
  return [preset.nameEn, preset.familyNameEn, ...(preset.searchAliases || [])].filter(Boolean);
}
function score(preset, candidate) {
  const sourceNames = candidateNames(preset);
  const sourceTokens = new Set(sourceNames.flatMap(tokens));
  const targetTokens = new Set(tokens(candidate.name));
  const common = [...sourceTokens].filter((token) => targetTokens.has(token));
  const union = new Set([...sourceTokens, ...targetTokens]);
  let value = union.size ? common.length / union.size : 0;

  // A shared movement word is more meaningful than words such as "seated".
  const sharedMovements = common.filter((token) => movementTokens.has(token));
  value += Math.min(sharedMovements.length, 2) * 0.18;

  const sourceEquipment = [...sourceTokens].filter((token) => equipmentTokens.has(token));
  const targetEquipment = [...targetTokens].filter((token) => equipmentTokens.has(token));
  if (sourceEquipment.length && targetEquipment.length) {
    value += sourceEquipment.some((token) => targetEquipment.includes(token)) ? 0.22 : -0.16;
  }
  const sourceName = normalise(preset.nameEn);
  const targetName = normalise(candidate.name);
  if (sourceName === targetName) value = 2;
  else if (targetName.includes(sourceName) || sourceName.includes(targetName)) value += 0.3;
  return Math.max(0, value);
}
function findMatch(preset, records, nameFor) {
  const scored = records.map((record) => ({ record, value: score(preset, { name: nameFor(record) }) }))
    .sort((a, b) => b.value - a.value);
  const best = scored[0];
  const exact = best && normalise(preset.nameEn) === normalise(nameFor(best.record));
  return {
    status: exact ? 'exact' : best && best.value >= 0.56 ? 'review' : 'unmatched',
    score: best ? Number(best.value.toFixed(2)) : 0,
    candidateId: best ? String(best.record.id) : null,
    candidateName: best ? nameFor(best.record) : null,
  };
}

const rows = catalog.presets.map((preset) => ({
  presetId: preset.presetId,
  nameKo: preset.nameKo,
  nameEn: preset.nameEn,
  familyId: preset.familyId,
  equipment: preset.equipmentVariantId,
  freeExerciseDb: findMatch(preset, freeDb, (record) => record.name),
  repDb: findMatch(preset, repDb, (record) => record.name_en),
}));
function totals(key) {
  return ['exact', 'review', 'unmatched'].reduce((result, status) => {
    result[status] = rows.filter((row) => row[key].status === status).length;
    return result;
  }, {});
}
const result = {
  generatedAt: new Date().toISOString(),
  catalog: { presets: catalog.presets.length, families: catalog.families.length },
  providers: {
    freeExerciseDb: { records: freeDb.length, totals: totals('freeExerciseDb') },
    repDb: { records: repDb.length, totals: totals('repDb') },
  },
  rows,
};
const combined = {
  exactInEither: rows.filter((row) => row.freeExerciseDb.status === 'exact' || row.repDb.status === 'exact').length,
  candidateInEither: rows.filter((row) => row.freeExerciseDb.status !== 'unmatched' || row.repDb.status !== 'unmatched').length,
  unmatchedInBoth: rows.filter((row) => row.freeExerciseDb.status === 'unmatched' && row.repDb.status === 'unmatched').length,
};
result.combined = combined;
fs.writeFileSync(output('coverage-result.json'), `${JSON.stringify(result, null, 2)}\n`);

const markdownRows = rows.map((row) => [
  row.presetId, row.nameKo, row.nameEn, row.equipment,
  `${row.freeExerciseDb.status} (${row.freeExerciseDb.score})`, row.freeExerciseDb.candidateName || '-',
  `${row.repDb.status} (${row.repDb.score})`, row.repDb.candidateName || '-',
].map((value) => String(value).replaceAll('|', '\\|')).join(' | '));
const t = result.providers;
const markdown = `# LiftLog 무료 운동 데이터 커버리지 대조\n\n` +
`생성 시각: ${result.generatedAt}\n\n` +
`현재 카탈로그 ${catalog.presets.length}개 운동을 **이름·운동군·장비 단서**로 자동 대조한 초안입니다. ` +
`\`review\`는 사람이 동작·장비·자극 부위를 확인해야 하는 후보이며, 자동 승인된 매칭이 아닙니다.\n\n` +
`| 데이터셋 | 레코드 | 정확 이름 일치 | 검토 후보 | 후보 없음 |\n| --- | ---: | ---: | ---: | ---: |\n` +
`| Free Exercise DB | ${t.freeExerciseDb.records} | ${t.freeExerciseDb.totals.exact} | ${t.freeExerciseDb.totals.review} | ${t.freeExerciseDb.totals.unmatched} |\n` +
`| RepDB Free Tier | ${t.repDb.records} | ${t.repDb.totals.exact} | ${t.repDb.totals.review} | ${t.repDb.totals.unmatched} |\n\n` +
`두 데이터셋을 함께 후보로 두면 ${combined.exactInEither}개는 정확 이름이 일치하고, ${combined.candidateInEither}개는 최소 하나의 검토 후보가 있습니다. ` +
`나머지 ${combined.unmatchedInBoth}개는 두 곳 모두 자동 후보가 없습니다.\n\n` +
`## 운동별 결과\n\n` +
`| presetId | 한글명 | 영문명 | 장비 | Free Exercise DB | 후보 | RepDB | 후보 |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n` + markdownRows.join('\n') + '\n';
fs.writeFileSync(output('coverage-report.md'), markdown);
console.log(JSON.stringify(result.providers, null, 2));
