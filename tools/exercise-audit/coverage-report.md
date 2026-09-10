# LiftLog 무료 운동 데이터 커버리지 대조

생성 시각: 2026-09-10T07:46:07.576Z

현재 카탈로그 363개 운동을 **이름·운동군·장비 단서**로 자동 대조한 초안입니다. `review`는 사람이 동작·장비·자극 부위를 확인해야 하는 후보이며, 자동 승인된 매칭이 아닙니다.

| 데이터셋 | 레코드 | 정확 이름 일치 | 검토 후보 | 후보 없음 |
| --- | ---: | ---: | ---: | ---: |
| Free Exercise DB | 876 | 54 | 251 | 58 |
| RepDB Free Tier | 601 | 111 | 209 | 43 |

두 데이터셋을 함께 후보로 두면 130개는 정확 이름이 일치하고, 342개는 최소 하나의 검토 후보가 있습니다. 나머지 21개는 두 곳 모두 자동 후보가 없습니다.

## 운동별 결과

| presetId | 한글명 | 영문명 | 장비 | Free Exercise DB | 후보 | RepDB | 후보 |
| --- | --- | --- | --- | --- | --- | --- | --- |
chest_bodyweight_chest_dip | 가슴 딥스 | Chest Dip | bodyweight | unmatched (0.51) | Dip Machine | review (0.63) | Chest Dips
chest_bodyweight_incline_push_up | 인클라인 푸쉬업 | Incline Push-Up | bodyweight | exact (2) | Incline Push-Up | exact (2) | Incline Push-Up
chest_machine_decline_chest_press | 머신 디클라인 체스트 프레스 | Machine Decline Chest Press | machine | review (1.18) | Smith Machine Decline Press | review (1.15) | Machine Chest Press
chest_dumbbell_decline_bench_press | 덤벨 디클라인 벤치 프레스 | Dumbbell Decline Bench Press | dumbbell | review (1.58) | Decline Dumbbell Bench Press | review (1.41) | Decline Bench Press
chest_dumbbell_decline_fly | 덤벨 디클라인 플라이 | Dumbbell Decline Fly | dumbbell | review (0.8) | Decline Dumbbell Flyes | review (1.33) | Decline Dumbbell Fly
chest_barbell_decline_bench_press | 바벨 디클라인 벤치 프레스 | Barbell Decline Bench Press | barbell | review (1.58) | Decline Barbell Bench Press | review (1.58) | Decline Barbell Bench Press
chest_smith_decline_bench_press | 스미스머신 디클라인 벤치 프레스 | Smith Machine Decline Bench Press | smith_machine | review (1.38) | Smith Machine Bench Press | exact (2) | Smith Machine Decline Bench Press
chest_cable_high_to_low_fly | 케이블 하이 투 로우 플라이 | Cable High-to-Low Fly | cable | review (0.69) | Cable Rear Delt Fly | review (0.8) | Cable Fly
chest_cable_single_arm_high_to_low_fly | 원암 케이블 하이 투 로우 플라이 | Single-Arm Cable High-to-Low Fly | cable | review (0.62) | Cable Rear Delt Fly | review (0.69) | Cable Fly
chest_bodyweight_wide_push_up | 와이드 푸쉬업 | Wide Push-Up | bodyweight | review (1.18) | Push-Up Wide | review (0.98) | Push-Up
chest_machine_chest_press | 머신 체스트 프레스 | Machine Chest Press | machine | review (0.9) | Machine Bench Press | exact (2) | Machine Chest Press
chest_machine_iso_lateral_chest_press | 아이소 레터럴 체스트 프레스 | Iso-Lateral Chest Press | machine | review (0.58) | Cable Chest Press | review (0.58) | Cable Chest Press
machine_chest_fly | 머신 체스트 플라이 | Pec Deck Fly | machine | unmatched (0.39) | Dip Machine | review (1) | Machine Chest Fly
chest_machine_plate_loaded_chest_press | 플레이트 로드 체스트 프레스 | Plate-Loaded Chest Press | machine | review (0.58) | Leverage Chest Press | review (0.62) | Plate-Loaded Shrug
chest_dumbbell_flat_bench_press | 덤벨 플랫 벤치 프레스 | Dumbbell Flat Bench Press | dumbbell | review (1.33) | Dumbbell Bench Press | review (1.33) | Dumbbell Bench Press
chest_dumbbell_single_arm_bench_press | 원암 덤벨 벤치 프레스 | Single-Arm Dumbbell Chest Press | dumbbell | review (1.15) | One Arm Dumbbell Bench Press | review (1.08) | Dumbbell Bench Press
chest_dumbbell_flat_fly | 덤벨 플랫 플라이 | Dumbbell Flat Fly | dumbbell | unmatched (0.47) | One-Arm Flat Bench Dumbbell Flye | review (0.9) | Dumbbell Fly
chest_barbell_pause_bench_press | 바벨 포즈 벤치 프레스 | Barbell Pause Bench Press | barbell | review (1.18) | Barbell Guillotine Bench Press | review (1.33) | Barbell Bench Press
chest_barbell_flat_bench_press | 바벨 플랫 벤치 프레스 | Barbell Flat Bench Press | barbell | review (1.18) | Barbell Guillotine Bench Press | review (1.33) | Barbell Bench Press
chest_barbell_floor_press | 바벨 플로어 프레스 | Barbell Floor Press | barbell | review (1.18) | Barbell Guillotine Bench Press | review (1.33) | Barbell Bench Press
chest_smith_flat_bench_press | 스미스머신 플랫 벤치 프레스 | Smith Machine Flat Bench Press | smith_machine | review (1.38) | Smith Machine Bench Press | review (1.38) | Smith Machine Bench Press
chest_bodyweight_weighted_push_up | 중량 푸쉬업 | Weighted Push-Up | bodyweight | unmatched (0.51) | Clock Push-Up | review (0.98) | Push-Up
chest_bodyweight_push_up | 푸쉬업 | Push-Up | bodyweight | review (0.98) | Clock Push-Up | exact (2) | Push-Up
chest_dumbbell_neutral_grip_press | 덤벨 뉴트럴 그립 프레스 | Dumbbell Neutral-Grip Press | dumbbell | review (1.58) | Dumbbell Bench Press with Neutral Grip | review (1.25) | Close-Grip Dumbbell Bench Press
chest_dumbbell_squeeze_press | 덤벨 스퀴즈 프레스 | Dumbbell Squeeze Press | dumbbell | review (0.9) | Arnold Dumbbell Press | review (0.9) | Dumbbell Bench Press
dumbbell_pullover | 덤벨 풀오버 | Dumbbell Pullover | dumbbell | review (1.02) | Bent-Arm Dumbbell Pullover | exact (2) | Dumbbell Pullover
chest_cable_single_arm_fly | 원암 케이블 플라이 | Single-Arm Cable Fly | cable | review (0.72) | Single-Arm Cable Crossover | review (1.1) | Cable Fly
chest_cable_standing_chest_press | 케이블 스탠딩 체스트 프레스 | Cable Standing Chest Press | cable | review (1.58) | Standing Cable Chest Press | review (1.15) | Cable Chest Press
chest_cable_single_arm_chest_press | 원암 케이블 체스트 프레스 | Single-Arm Cable Chest Press | cable | review (1.3) | Cable Chest Press | review (1.3) | Cable Chest Press
chest_cable_crossover | 케이블 크로스오버 | Cable Crossover | cable | exact (2) | Cable Crossover | review (0.9) | Cable Fly
chest_band_chest_press | 밴드 체스트 프레스 | Band Chest Press | band | review (0.8) | Reverse Band Bench Press | review (0.68) | TRX Chest Press
chest_band_chest_fly | 밴드 체스트 플라이 | Band Chest Fly | band | unmatched (0.42) | Band Assisted Pull-Up | unmatched (0.52) | Machine Chest Fly
chest_band_push_up | 밴드 푸쉬업 | Band-Resisted Push-Up | band | unmatched (0.43) | Clock Push-Up | review (0.81) | Push-Up
chest_plate_squeeze_press | 플레이트 스퀴즈 프레스 | Plate Squeeze Press | plate | unmatched (0.55) | Standing Olympic Plate Hand Squeeze | unmatched (0.47) | Plate Pinch
chest_bodyweight_decline_push_up | 디클라인 푸쉬업 | Decline Push-Up | bodyweight | exact (2) | Decline Push-Up | exact (2) | Decline Push-Up
chest_machine_incline_chest_press | 머신 인클라인 체스트 프레스 | Machine Incline Chest Press | machine | review (1.08) | Smith Machine Incline Bench Press | review (1.15) | Machine Chest Press
chest_machine_plate_loaded_incline_press | 플레이트 로드 인클라인 프레스 | Plate-Loaded Incline Press | machine | review (0.86) | Leverage Incline Chest Press | review (0.65) | Paused Incline Bench Press
chest_dumbbell_incline_bench_press | 덤벨 인클라인 벤치 프레스 | Dumbbell Incline Bench Press | dumbbell | review (1.33) | Dumbbell Bench Press | review (1.33) | Dumbbell Bench Press
chest_dumbbell_single_arm_incline_press | 원암 인클라인 덤벨 벤치 프레스 | Single-Arm Incline Dumbbell Chest Press | dumbbell | review (1.08) | One Arm Dumbbell Bench Press | review (1.01) | Dumbbell Bench Press
chest_dumbbell_incline_fly | 덤벨 인클라인 플라이 | Dumbbell Incline Fly | dumbbell | review (0.8) | Dumbbell Incline Row | review (1.33) | Incline Dumbbell Fly
chest_barbell_guillotine_press | 바벨 길로틴 프레스 | Barbell Guillotine Press | barbell | review (1.58) | Barbell Guillotine Bench Press | review (1.33) | Barbell Bench Press
chest_barbell_incline_bench_press | 바벨 인클라인 벤치 프레스 | Barbell Incline Bench Press | barbell | review (1.55) | Barbell Incline Bench Press - Medium Grip | review (1.58) | Incline Barbell Bench Press
chest_smith_incline_bench_press | 스미스머신 인클라인 벤치 프레스 | Smith Machine Incline Bench Press | smith_machine | exact (2) | Smith Machine Incline Bench Press | exact (2) | Smith Machine Incline Bench Press
chest_cable_low_to_high_fly | 케이블 로우 투 하이 플라이 | Cable Low-to-High Fly | cable | review (0.69) | Cable Rear Delt Fly | review (0.8) | Cable Fly
chest_cable_single_arm_low_to_high_fly | 원암 케이블 로우 투 하이 플라이 | Single-Arm Cable Low-to-High Fly | cable | review (0.62) | Cable Rear Delt Fly | review (0.69) | Cable Fly
back_bodyweight_reverse_hyperextension | 맨몸 리버스 하이퍼익스텐션 | Bodyweight Reverse Hyperextension | bodyweight | review (1.15) | Reverse Hyperextension | review (0.9) | Bodyweight Reverse Lunge
back_bodyweight_back_extension | 맨몸 백 익스텐션 | Bodyweight Back Extension | bodyweight | unmatched (0.47) | Bodyweight Flyes | review (1.33) | Back Extension
back_machine_reverse_hyperextension | 리버스 하이퍼익스텐션 머신 | Reverse Hyperextension Machine | machine | review (1.15) | Reverse Hyperextension | review (0.8) | Smith Machine Reverse Lunge
back_machine_back_extension | 백 익스텐션 머신 | Back Extension Machine | machine | review (0.9) | Machine Triceps Extension | review (1.58) | Machine Back Extension
back_barbell_rack_pull | 랙 풀 | Rack Pull | barbell | review (0.8) | Rack Pull with Bands | exact (2) | Rack Pull
back_barbell_deadlift | 바벨 데드리프트 | Barbell Deadlift | barbell | exact (2) | Barbell Deadlift | exact (2) | Barbell Deadlift
back_barbell_snatch_grip_deadlift | 스내치 그립 데드리프트 | Snatch-Grip Deadlift | barbell | review (0.85) | Snatch Deadlift | review (0.63) | Snatch
back_bodyweight_neutral_grip_pull_up | 뉴트럴 그립 풀업 | Neutral-Grip Pull-Up | bodyweight | review (0.58) | Wide-Grip Rear Pull-Up | review (0.81) | Pull-Up
back_bodyweight_scapular_pull_up | 스캐풀라 풀업 | Scapular Pull-Up | bodyweight | exact (2) | Scapular Pull-Up | review (0.98) | Pull-Up
back_bodyweight_wide_grip_pull_up | 와이드 그립 풀업 | Wide-Grip Pull-Up | bodyweight | review (0.93) | Wide-Grip Rear Pull-Up | review (0.81) | Pull-Up
back_bodyweight_chin_up | 친업 | Chin-Up | bodyweight | exact (2) | Chin-Up | review (0.68) | Pull-Up
back_bodyweight_pull_up | 풀업 | Pull-Up | bodyweight | review (0.98) | Scapular Pull-Up | exact (2) | Pull-Up
back_machine_neutral_grip_lat_pulldown | 뉴트럴 그립 랫 풀다운 | Neutral-Grip Lat Pulldown | machine | review (0.78) | Wide-Grip Lat Pulldown | review (0.98) | Lat Pulldown
back_machine_lat_pulldown | 랫 풀다운 | Lat Pulldown | machine | review (0.98) | One Arm Lat Pulldown | exact (2) | Lat Pulldown
back_machine_low_row | 로우 로우 머신 | Low Row Machine | machine | review (0.8) | Smith Machine Upright Row | review (0.8) | Smith Machine Upright Row
back_machine_reverse_grip_lat_pulldown | 리버스 그립 랫 풀다운 | Reverse-Grip Lat Pulldown | machine | review (0.78) | Wide-Grip Lat Pulldown | exact (2) | Reverse Grip Lat Pulldown
back_machine_pullover | 머신 풀오버 | Machine Pullover | machine | unmatched (0.55) | Dip Machine | unmatched (0.55) | Rowing Machine
back_machine_assisted_pull_up | 어시스트 풀업 | Assisted Pull-Up | machine | review (1.15) | Band Assisted Pull-Up | review (0.98) | Pull-Up
back_machine_wide_grip_lat_pulldown | 와이드 그립 랫 풀다운 | Wide-Grip Lat Pulldown | machine | exact (2) | Wide-Grip Lat Pulldown | review (0.98) | Lat Pulldown
back_machine_high_row | 하이 로우 머신 | High Row Machine | machine | review (0.8) | Smith Machine Upright Row | review (0.8) | Smith Machine Upright Row
back_dumbbell_one_arm_row | 원암 덤벨 로우 | One-Arm Dumbbell Row | dumbbell | exact (2) | One-Arm Dumbbell Row | review (1) | Single-Arm Dumbbell Row
back_dumbbell_kroc_row | 크록 로우 | Kroc Row | dumbbell | unmatched (0.51) | Inverted Row | unmatched (0.51) | Inverted Row
back_barbell_yates_row | 예이츠 로우 | Yates Row | barbell | unmatched (0.51) | Inverted Row | unmatched (0.51) | Inverted Row
back_cable_straight_arm_pulldown | 스트레이트 암 풀다운 | Straight-Arm Pulldown | cable | exact (2) | Straight-Arm Pulldown | exact (2) | Straight-Arm Pulldown
back_cable_single_arm_straight_arm_pulldown | 원암 스트레이트 암 케이블 풀다운 | Single-Arm Straight-Arm Cable Pulldown | cable | review (0.78) | Straight-Arm Pulldown | review (0.78) | Straight-Arm Pulldown
back_cable_single_arm_lat_pulldown | 원암 랫 풀다운 | Single-Arm Lat Pulldown | cable | review (0.78) | One Arm Lat Pulldown | review (0.98) | Lat Pulldown
back_cable_single_arm_row | 원암 케이블 로우 | Single-Arm Cable Row | cable | review (0.82) | Single-Arm Cable Crossover | review (0.8) | Cable Upright Row
back_cable_kneeling_pullover | 케이블 닐링 풀오버 | Kneeling Cable Pullover | cable | review (0.62) | Kneeling Cable Triceps Extension | review (0.72) | Kneeling Cable Row
back_cable_high_row | 케이블 하이 로우 | Cable High Row | cable | review (0.9) | Upright Cable Row | review (0.9) | Cable Upright Row
back_cable_single_arm_high_row | 원암 케이블 하이 로우 | Single-Arm Cable High Row | cable | review (0.75) | Kneeling Single-Arm High Pulley Row | review (0.73) | Cable Upright Row
back_band_lat_pulldown | 밴드 랫 풀다운 | Band Lat Pulldown | band | review (0.58) | One Arm Lat Pulldown | review (1.15) | Lat Pulldown
back_band_assisted_pull_up | 밴드 어시스트 풀업 | Band-Assisted Pull-Up | band | exact (2) | Band Assisted Pull-Up | review (1.02) | Band Assisted Pull Ups
back_kettlebell_one_arm_row | 원암 케틀벨 로우 | One-Arm Kettlebell Row | kettlebell | exact (2) | One-Arm Kettlebell Row | exact (2) | One Arm Kettlebell Row
back_bodyweight_inverted_row | 인버티드 로우 | Inverted Row | bodyweight | exact (2) | Inverted Row | exact (2) | Inverted Row
back_machine_chest_supported_row | 머신 체스트 서포티드 로우 | Machine Chest-Supported Row | machine | review (0.73) | Smith Machine Upright Row | review (1.2) | Chest-Supported Smith Machine Row
back_machine_t_bar_row | 머신 티바 로우 | Machine T-Bar Row | machine | review (0.78) | Lying T-Bar Row | review (1.23) | T-Bar Row
back_machine_seated_row | 시티드 로우 머신 | Seated Row Machine | machine | review (0.8) | Smith Machine Upright Row | review (0.9) | Machine Seated Crunch
back_machine_iso_lateral_row | 아이소 레터럴 로우 | Iso-Lateral Row | machine | review (0.68) | Leverage Iso Row | unmatched (0.43) | Inverted Row
back_dumbbell_chest_supported_row | 덤벨 체스트 서포티드 로우 | Dumbbell Chest-Supported Row | dumbbell | review (0.8) | Dumbbell Incline Row | review (1.4) | Chest-Supported Dumbbell Row
back_dumbbell_single_arm_chest_supported_row | 원암 덤벨 체스트 서포티드 로우 | Single-Arm Chest-Supported Dumbbell Row | dumbbell | review (0.83) | One-Arm Dumbbell Row | exact (2) | Single-Arm Chest-Supported Dumbbell Row
back_dumbbell_renegade_row | 레니게이드 로우 | Renegade Row | dumbbell | review (1.15) | Alternating Renegade Row | unmatched (0.51) | Inverted Row
back_dumbbell_incline_row | 인클라인 덤벨 로우 | Incline Dumbbell Row | dumbbell | review (1.58) | Dumbbell Incline Row | review (0.9) | Dumbbell Upright Row
back_barbell_landmine_row | 랜드마인 로우 | Landmine Row | barbell | unmatched (0.51) | Inverted Row | unmatched (0.51) | Inverted Row
back_barbell_bent_over_row | 바벨 벤트오버 로우 | Barbell Bent-Over Row | barbell | review (1.4) | Bent Over Barbell Row | review (1.4) | Bent-Over Barbell Row
back_barbell_t_bar_row | 바벨 티바 로우 | Barbell T-Bar Row | barbell | review (0.8) | Upright Barbell Row | review (1.23) | T-Bar Row
back_barbell_pendlay_row | 펜들레이 로우 | Pendlay Row | barbell | unmatched (0.51) | Inverted Row | exact (2) | Pendlay Row
back_cable_seated_row | 시티드 케이블 로우 | Seated Cable Row | cable | review (1.2) | Seated Cable Rows | exact (2) | Seated Cable Row
back_band_row | 밴드 로우 | Band Row | band | unmatched (0.51) | Inverted Row | unmatched (0.51) | Inverted Row
back_plate_loaded_row | 플레이트 로우 | Plate Row | plate | unmatched (0.55) | Plate Pinch | unmatched (0.55) | Plate Pinch
back_machine_shrug | 머신 슈러그 | Machine Shrug | machine | review (0.9) | Calf-Machine Shoulder Shrug | review (1.37) | Smith Machine Shrug
back_dumbbell_shrug | 덤벨 슈러그 | Dumbbell Shrug | dumbbell | exact (2) | Dumbbell Shrug | exact (2) | Dumbbell Shrug
back_barbell_shrug | 바벨 슈러그 | Barbell Shrug | barbell | exact (2) | Barbell Shrug | exact (2) | Barbell Shrug
back_cable_shrug | 케이블 슈러그 | Cable Shrug | cable | review (0.85) | Cable Shrugs | unmatched (0.55) | Cable Crunch
legs_machine_hip_abduction | 힙 어브덕션 머신 | Hip Abduction Machine | machine | review (0.8) | Smith Machine Hip Raise | review (1.58) | Machine Hip Abduction
legs_cable_hip_abduction | 케이블 힙 어브덕션 | Cable Hip Abduction | cable | review (0.9) | Cable Hip Adduction | review (0.76) | Banded Seated Hip Abduction
legs_band_lateral_walk | 밴드 레터럴 워크 | Band Lateral Walk | band | unmatched (0.42) | Band Assisted Pull-Up | unmatched (0.5) | Banded Lateral Walk
legs_band_hip_abduction | 밴드 힙 어브덕션 | Band Hip Abduction | band | review (0.9) | Band Hip Adductions | review (0.76) | Banded Seated Hip Abduction
legs_machine_hip_adduction | 힙 어덕션 머신 | Hip Adduction Machine | machine | review (0.8) | Smith Machine Hip Raise | review (1.33) | Hip Adduction
legs_dumbbell_sumo_squat | 덤벨 스모 스쿼트 | Dumbbell Sumo Squat | dumbbell | review (1.07) | Dumbbell Squat | exact (2) | Dumbbell Sumo Squat
legs_cable_hip_adduction | 케이블 힙 어덕션 | Cable Hip Adduction | cable | exact (2) | Cable Hip Adduction | review (1.33) | Hip Adduction
legs_bodyweight_standing_calf_raise | 맨몸 스탠딩 카프 레이즈 | Bodyweight Standing Calf Raise | bodyweight | review (0.96) | Rocking Standing Calf Raise | review (1.41) | Standing Calf Raise
legs_bodyweight_single_leg_calf_raise | 싱글 레그 카프 레이즈 | Single-Leg Calf Raise | bodyweight | review (0.79) | Dumbbell Seated One-Leg Calf Raise | exact (2) | Single Leg Calf Raise
legs_machine_leg_press_calf_raise | 레그프레스 카프 레이즈 | Leg Press Calf Raise | machine | review (1.16) | Leg Press | review (1.16) | Leg Press
legs_machine_standing_calf_raise | 스탠딩 카프 레이즈 머신 | Standing Calf Raise Machine | machine | review (1.18) | Smith Machine Calf Raise | review (1.41) | Standing Calf Raise
legs_machine_seated_calf_raise | 시티드 카프 레이즈 머신 | Seated Calf Raise Machine | machine | review (1.41) | Seated Calf Raise | review (1.41) | Seated Calf Raise
legs_dumbbell_standing_calf_raise | 덤벨 스탠딩 카프 레이즈 | Dumbbell Standing Calf Raise | dumbbell | review (1.58) | Standing Dumbbell Calf Raise | review (1.41) | Standing Calf Raise
legs_dumbbell_single_leg_calf_raise | 원레그 덤벨 카프 레이즈 | Single-Leg Dumbbell Calf Raise | dumbbell | review (1.18) | Calf Raise On A Dumbbell | review (1.48) | Dumbbell Calf Raise
legs_barbell_standing_calf_raise | 바벨 스탠딩 카프 레이즈 | Barbell Standing Calf Raise | barbell | review (1.58) | Standing Barbell Calf Raise | review (1.41) | Standing Calf Raise
legs_smith_calf_raise | 스미스머신 카프 레이즈 | Smith Machine Calf Raise | smith_machine | exact (2) | Smith Machine Calf Raise | exact (2) | Smith Machine Calf Raise
legs_bodyweight_glute_bridge | 맨몸 글루트 브릿지 | Bodyweight Glute Bridge | bodyweight | unmatched (0.47) | Bodyweight Flyes | review (0.97) | Glute Bridge
legs_bodyweight_reverse_lunge | 맨몸 리버스 런지 | Bodyweight Reverse Lunge | bodyweight | review (0.9) | Bodyweight Walking Lunge | exact (2) | Bodyweight Reverse Lunge
legs_bodyweight_single_leg_glute_bridge | 싱글 레그 글루트 브릿지 | Single-Leg Glute Bridge | bodyweight | exact (2) | Single Leg Glute Bridge | exact (2) | Single Leg Glute Bridge
legs_machine_glute_kickback | 글루트 킥백 머신 | Glute Kickback Machine | machine | review (1.15) | Glute Kickback | review (1.15) | Glute Kickback
legs_machine_hip_thrust | 힙 쓰러스트 머신 | Hip Thrust Machine | machine | review (0.8) | Smith Machine Hip Raise | review (1.15) | Smith Machine Hip Thrust
legs_dumbbell_reverse_lunge | 덤벨 리버스 런지 | Dumbbell Reverse Lunge | dumbbell | review (0.9) | Dumbbell Rear Lunge | review (1.33) | Reverse Lunge
legs_dumbbell_hip_thrust | 덤벨 힙 쓰러스트 | Dumbbell Hip Thrust | dumbbell | unmatched (0.52) | Barbell Hip Thrust | exact (2) | Dumbbell Hip Thrust
legs_dumbbell_single_leg_hip_thrust | 원레그 덤벨 힙 쓰러스트 | Single-Leg Dumbbell Hip Thrust | dumbbell | review (0.62) | Dumbbell Seated One-Leg Calf Raise | review (1.3) | Dumbbell Hip Thrust
legs_barbell_low_bar_squat | 로우바 스쿼트 | Low-Bar Back Squat | barbell | unmatched (0.38) | Barbell Squat | review (0.76) | Barbell Back Squat
legs_barbell_glute_bridge | 바벨 글루트 브릿지 | Barbell Glute Bridge | barbell | exact (2) | Barbell Glute Bridge | exact (2) | Barbell Glute Bridge
legs_barbell_reverse_lunge | 바벨 리버스 런지 | Barbell Reverse Lunge | barbell | review (1.07) | Barbell Lunge | exact (2) | Barbell Reverse Lunge
legs_barbell_hip_thrust | 바벨 힙 쓰러스트 | Barbell Hip Thrust | barbell | exact (2) | Barbell Hip Thrust | exact (2) | Barbell Hip Thrust
legs_barbell_box_squat | 박스 스쿼트 | Box Squat | barbell | exact (2) | Box Squat | exact (2) | Box Squat
legs_barbell_sumo_deadlift | 스모 데드리프트 | Sumo Deadlift | barbell | exact (2) | Sumo Deadlift | exact (2) | Sumo Deadlift
legs_smith_hip_thrust | 스미스머신 힙 쓰러스트 | Smith Machine Hip Thrust | smith_machine | review (1) | Smith Machine Hip Raise | exact (2) | Smith Machine Hip Thrust
legs_cable_glute_kickback | 케이블 글루트 킥백 | Cable Glute Kickback | cable | review (1.15) | Glute Kickback | exact (2) | Cable Glute Kickback
legs_cable_pull_through | 케이블 풀 스루 | Cable Pull-Through | cable | review (0.97) | Pull Through | review (0.72) | Cable Face Pull
legs_band_glute_bridge | 밴드 글루트 브릿지 | Band Glute Bridge | band | review (0.62) | IT Band and Glute Stretch | review (0.97) | Glute Bridge
legs_band_kickback | 밴드 글루트 킥백 | Band Glute Kickback | band | review (1.15) | Glute Kickback | review (1.15) | Glute Kickback
legs_band_hip_thrust | 밴드 힙 쓰러스트 | Band Hip Thrust | band | review (0.9) | Band Hip Adductions | review (0.68) | Banded Hip Thrust
legs_kettlebell_sumo_deadlift | 케틀벨 스모 데드리프트 | Kettlebell Sumo Deadlift | kettlebell | review (1.15) | Sumo Deadlift | exact (2) | Kettlebell Sumo Deadlift
legs_kettlebell_swing | 케틀벨 스윙 | Kettlebell Swing | kettlebell | review (0.72) | One-Arm Kettlebell Swings | exact (2) | Kettlebell Swing
legs_bodyweight_nordic_hamstring_curl | 노르딕 햄스트링 컬 | Nordic Hamstring Curl | bodyweight | review (0.86) | Ball Leg Curl | exact (2) | Nordic Hamstring Curl
legs_machine_glute_ham_raise | 글루트 햄 레이즈 | Glute-Ham Raise | machine | exact (2) | Glute Ham Raise | unmatched (0.38) | Barbell Calf Raise
legs_machine_lying_leg_curl | 라잉 레그 컬 | Lying Leg Curl | machine | review (1.16) | Lying Leg Curls | exact (2) | Lying Leg Curl
legs_machine_single_leg_lying_curl | 원레그 라잉 레그 컬 | Single-Leg Lying Leg Curl | machine | review (0.76) | Ball Leg Curl | exact (2) | Single Leg Lying Leg Curl
legs_machine_standing_leg_curl | 스탠딩 레그 컬 | Standing Leg Curl | machine | exact (2) | Standing Leg Curl | review (1.41) | Banded Standing Leg Curl
legs_machine_seated_leg_curl | 시티드 레그 컬 | Seated Leg Curl | machine | exact (2) | Seated Leg Curl | exact (2) | Seated Leg Curl
legs_machine_single_leg_seated_curl | 원레그 시티드 레그 컬 | Single-Leg Seated Leg Curl | machine | review (1.41) | Seated Leg Curl | review (1.41) | Seated Leg Curl
legs_dumbbell_romanian_deadlift | 덤벨 루마니안 데드리프트 | Dumbbell Romanian Deadlift | dumbbell | review (0.8) | Romanian Deadlift | exact (2) | Dumbbell Romanian Deadlift
legs_dumbbell_single_leg_romanian_deadlift | 원레그 덤벨 루마니안 데드리프트 | Single-Leg Dumbbell Romanian Deadlift | dumbbell | review (0.65) | Dumbbell Seated One-Leg Calf Raise | review (1.37) | One-Arm Single-Leg Dumbbell Romanian Deadlift
legs_dumbbell_stiff_leg_deadlift | 덤벨 스티프 레그 데드리프트 | Dumbbell Stiff-Leg Deadlift | dumbbell | review (1) | Stiff-Legged Dumbbell Deadlift | review (1.41) | Stiff Leg Deadlift
legs_barbell_good_morning | 바벨 굿모닝 | Barbell Good Morning | barbell | review (1.12) | Stiff Leg Barbell Good Morning | review (0.97) | Good Morning
legs_barbell_romanian_deadlift | 바벨 루마니안 데드리프트 | Barbell Romanian Deadlift | barbell | review (0.8) | Romanian Deadlift | review (0.8) | Romanian Deadlift
legs_barbell_stiff_leg_deadlift | 바벨 스티프 레그 데드리프트 | Barbell Stiff-Leg Deadlift | barbell | review (1) | Stiff-Legged Barbell Deadlift | review (1.41) | Stiff Leg Deadlift
legs_smith_romanian_deadlift | 스미스머신 루마니안 데드리프트 | Smith Machine Romanian Deadlift | smith_machine | review (0.72) | Smith Machine Squat | exact (2) | Smith Machine Romanian Deadlift
legs_cable_leg_curl | 케이블 레그 컬 | Cable Leg Curl | cable | review (0.9) | Cable Preacher Curl | review (1.07) | Cable Curl
legs_band_leg_curl | 밴드 레그 컬 | Band Leg Curl | band | review (1.63) | Seated Band Hamstring Curl | review (0.86) | Lying Leg Curl
legs_bodyweight_squat | 맨몸 스쿼트 | Bodyweight Squat | bodyweight | exact (2) | Bodyweight Squat | exact (2) | Bodyweight Squat
legs_bodyweight_lunge | 맨몸 런지 | Bodyweight Lunge | bodyweight | review (1.07) | Bodyweight Walking Lunge | review (1.07) | Bodyweight Reverse Lunge
legs_bodyweight_bulgarian_split_squat | 맨몸 불가리안 스플릿 스쿼트 | Bodyweight Bulgarian Split Squat | bodyweight | review (0.9) | Bodyweight Squat | review (1.23) | Bulgarian Split Squat
legs_bodyweight_step_up | 맨몸 스텝업 | Bodyweight Step-Up | bodyweight | unmatched (0.47) | Bodyweight Flyes | unmatched (0.47) | Bodyweight Squat
legs_bodyweight_sissy_squat | 시시 스쿼트 | Sissy Squat | bodyweight | review (1.15) | Weighted Sissy Squat | unmatched (0.51) | Banded Squat
legs_bodyweight_wall_sit | 월 싯 | Wall Sit | bodyweight | unmatched (0.33) | Sit-Up | exact (2) | Wall Sit
legs_bodyweight_jump_squat | 점프 스쿼트 | Jump Squat | bodyweight | review (1.15) | Freehand Jump Squat | exact (2) | Jump Squat
legs_bodyweight_pistol_squat | 피스톨 스쿼트 | Pistol Squat | bodyweight | review (1.15) | Kettlebell Pistol Squat | exact (2) | Pistol Squat
legs_machine_leg_extension | 레그 익스텐션 | Leg Extension | machine | review (1.33) | Single-Leg Leg Extension | exact (2) | Leg Extension
legs_machine_single_leg_extension | 원레그 레그 익스텐션 | Single-Leg Extension | machine | review (1.36) | Single-Leg Leg Extension | exact (2) | Single Leg Extension
legs_machine_leg_press | 레그 프레스 | Leg Press | machine | exact (2) | Leg Press | exact (2) | Leg Press
legs_machine_single_leg_press | 원레그 레그 프레스 | Single-Leg Press | machine | review (1.33) | Leg Press | exact (2) | Single Leg Press
legs_machine_belt_squat | 벨트 스쿼트 | Belt Squat | machine | review (0.9) | Lying Machine Squat | review (0.9) | Smith Machine Squat
legs_machine_v_squat | 브이 스쿼트 머신 | V-Squat Machine | machine | review (0.9) | Lying Machine Squat | review (0.9) | Smith Machine Squat
legs_machine_pendulum_squat | 펜듈럼 스쿼트 | Pendulum Squat | machine | review (0.9) | Lying Machine Squat | review (0.9) | Smith Machine Squat
legs_machine_hack_squat | 핵 스쿼트 머신 | Hack Squat Machine | machine | review (1.15) | Hack Squat | review (1.15) | Hack Squat
legs_dumbbell_goblet_squat | 덤벨 고블릿 스쿼트 | Dumbbell Goblet Squat | dumbbell | review (1.15) | Goblet Squat | review (1.15) | Goblet Squat
legs_dumbbell_lunge | 덤벨 런지 | Dumbbell Lunge | dumbbell | review (1.07) | Dumbbell Rear Lunge | exact (2) | Dumbbell Lunge
legs_dumbbell_bulgarian_split_squat | 덤벨 불가리안 스플릿 스쿼트 | Dumbbell Bulgarian Split Squat | dumbbell | review (0.9) | Dumbbell Squat | review (1.23) | Bulgarian Split Squat
legs_dumbbell_squat | 덤벨 스쿼트 | Dumbbell Squat | dumbbell | exact (2) | Dumbbell Squat | exact (2) | Dumbbell Squat
legs_dumbbell_step_up | 덤벨 스텝업 | Dumbbell Step-Up | dumbbell | review (1.02) | Dumbbell Step Ups | unmatched (0.47) | Dumbbell Fly
legs_dumbbell_walking_lunge | 덤벨 워킹 런지 | Dumbbell Walking Lunge | dumbbell | review (0.9) | Dumbbell Rear Lunge | review (1.15) | Walking Lunge
legs_barbell_back_squat | 바벨 백 스쿼트 | Barbell Back Squat | barbell | review (1.07) | Barbell Squat | exact (2) | Barbell Back Squat
legs_barbell_bulgarian_split_squat | 바벨 불가리안 스플릿 스쿼트 | Barbell Bulgarian Split Squat | barbell | review (1) | Barbell Side Split Squat | review (1.23) | Bulgarian Split Squat
legs_barbell_walking_lunge | 바벨 워킹 런지 | Barbell Walking Lunge | barbell | exact (2) | Barbell Walking Lunge | review (1.15) | Walking Lunge
legs_barbell_front_squat | 바벨 프론트 스쿼트 | Barbell Front Squat | barbell | review (1.58) | Front Barbell Squat | review (1.33) | Front Squat
legs_barbell_zercher_squat | 저쳐 스쿼트 | Zercher Squat | barbell | review (0.63) | Zercher Squats | unmatched (0.51) | Banded Squat
legs_barbell_high_bar_squat | 하이바 스쿼트 | High-Bar Back Squat | barbell | unmatched (0.47) | Single-Leg High Box Squat | review (0.76) | Barbell Back Squat
legs_smith_bulgarian_split_squat | 스미스머신 불가리안 스플릿 스쿼트 | Smith Machine Bulgarian Split Squat | smith_machine | review (1) | Smith Machine Squat | exact (2) | Smith Machine Bulgarian Split Squat
legs_smith_squat | 스미스머신 스쿼트 | Smith Machine Squat | smith_machine | exact (2) | Smith Machine Squat | exact (2) | Smith Machine Squat
legs_smith_split_squat | 스미스머신 스플릿 스쿼트 | Smith Machine Split Squat | smith_machine | review (1.15) | Smith Machine Squat | exact (2) | Smith Machine Split Squat
legs_smith_front_squat | 스미스머신 프론트 스쿼트 | Smith Machine Front Squat | smith_machine | review (1.15) | Smith Machine Squat | exact (2) | Smith Machine Front Squat
legs_kettlebell_goblet_squat | 케틀벨 고블릿 스쿼트 | Kettlebell Goblet Squat | kettlebell | review (1.15) | Goblet Squat | review (1.15) | Goblet Squat
legs_plate_goblet_squat | 플레이트 고블릿 스쿼트 | Plate Goblet Squat | plate | review (1.15) | Goblet Squat | review (1.15) | Goblet Squat
shoulders_bodyweight_pike_push_up | 파이크 푸쉬업 | Pike Push-Up | bodyweight | unmatched (0.51) | Clock Push-Up | review (0.98) | Push-Up
shoulders_machine_shoulder_press | 머신 숄더 프레스 | Machine Shoulder Press | machine | review (1.2) | Smith Machine Overhead Shoulder Press | exact (2) | Machine Shoulder Press
shoulders_machine_plate_loaded_shoulder_press | 플레이트 로드 숄더 프레스 | Plate-Loaded Shoulder Press | machine | unmatched (0.51) | Leverage Shoulder Press | unmatched (0.55) | Plate-Loaded Shrug
shoulders_dumbbell_shoulder_press | 덤벨 숄더 프레스 | Dumbbell Shoulder Press | dumbbell | exact (2) | Dumbbell Shoulder Press | exact (2) | Dumbbell Shoulder Press
shoulders_dumbbell_single_arm_shoulder_press | 원암 덤벨 숄더 프레스 | Single-Arm Dumbbell Shoulder Press | dumbbell | review (1.2) | Dumbbell Shoulder Press | review (1.2) | Dumbbell Shoulder Press
shoulders_dumbbell_front_raise | 덤벨 프론트 레이즈 | Dumbbell Front Raise | dumbbell | review (1.58) | Front Dumbbell Raise | exact (2) | Dumbbell Front Raise
shoulders_dumbbell_seated_shoulder_press | 시티드 덤벨 숄더 프레스 | Seated Dumbbell Shoulder Press | dumbbell | review (1.3) | Dumbbell Shoulder Press | exact (2) | Seated Dumbbell Shoulder Press
shoulders_barbell_overhead_press | 바벨 오버헤드 프레스 | Barbell Overhead Press | barbell | review (0.9) | Barbell Shoulder Press | exact (2) | Barbell Overhead Press
shoulders_barbell_single_arm_landmine_press | 원암 랜드마인 프레스 | Single-Arm Landmine Press | barbell | unmatched (0.51) | One Arm Floor Press | review (0.98) | Landmine Press
shoulders_barbell_front_raise | 바벨 프론트 레이즈 | Barbell Front Raise | barbell | review (1.08) | Standing Front Barbell Raise Over Head | exact (2) | Barbell Front Raise
shoulders_barbell_seated_overhead_press | 시티드 바벨 숄더 프레스 | Seated Barbell Shoulder Press | barbell | review (1.3) | Barbell Shoulder Press | review (1.38) | Seated Barbell Overhead Press
shoulders_smith_shoulder_press | 스미스머신 숄더 프레스 | Smith Machine Shoulder Press | smith_machine | review (1.4) | Smith Machine Overhead Shoulder Press | exact (2) | Smith Machine Shoulder Press
shoulders_cable_front_raise | 케이블 프론트 레이즈 | Cable Front Raise | cable | review (1.58) | Front Cable Raise | exact (2) | Cable Front Raise
shoulders_cable_single_arm_front_raise | 원암 케이블 프론트 레이즈 | Single-Arm Cable Front Raise | cable | review (1.18) | Front Cable Raise | review (1.48) | Cable Front Raise
shoulders_kettlebell_press | 케틀벨 숄더 프레스 | Kettlebell Shoulder Press | kettlebell | review (0.8) | Alternating Kettlebell Press | review (1.2) | One Arm Kettlebell Shoulder Press
shoulders_plate_overhead_press | 플레이트 오버헤드 프레스 | Plate Overhead Press | plate | unmatched (0.47) | Plate Pinch | review (0.68) | Paused Overhead Press
shoulders_plate_front_raise | 플레이트 프론트 레이즈 | Plate Front Raise | plate | review (1.58) | Front Plate Raise | review (0.8) | Plate-Loaded Lateral Raise
shoulders_bodyweight_wall_handstand_push_up | 월 핸드스탠드 푸쉬업 | Wall Handstand Push-Up | bodyweight | unmatched (0.43) | Clock Push-Up | review (0.81) | Push-Up
shoulders_bodyweight_handstand_push_up | 핸드스탠드 푸쉬업 | Handstand Push-Up | bodyweight | review (0.63) | Handstand Push-Ups | review (0.98) | Push-Up
shoulders_dumbbell_arnold_press | 아놀드 프레스 | Arnold Press | dumbbell | review (0.98) | Kettlebell Arnold Press | exact (2) | Arnold Press
shoulders_barbell_push_press | 바벨 푸쉬 프레스 | Barbell Push Press | barbell | review (1.15) | Push Press | review (1.15) | Push Press
shoulders_barbell_bradford_press | 브래드포드 프레스 | Bradford Press | barbell | review (0.98) | Standing Bradford Press | review (0.68) | Bodyweight Overhead Press
shoulders_kettlebell_bottoms_up_press | 케틀벨 바텀업 프레스 | Kettlebell Bottoms-Up Press | kettlebell | review (0.73) | Alternating Kettlebell Press | review (1.27) | One-Arm Kettlebell Bottoms-Up Press
shoulders_bodyweight_prone_y_raise | 프론 Y 레이즈 | Prone Y Raise | bodyweight | unmatched (0.43) | Dumbbell Raise | unmatched (0.38) | Barbell Calf Raise
machine_rear_delt_fly | 머신 리어 델트 플라이 | Reverse Pec Deck | machine | review (0.65) | Reverse Machine Flyes | review (0.65) | Machine Chest Fly
dumbbell_rear_delt_fly | 덤벨 리어 델트 플라이 | Dumbbell Rear Delt Fly | dumbbell | review (0.62) | Cable Rear Delt Fly | review (1.23) | Rear Delt Fly
shoulders_dumbbell_cuban_press | 덤벨 쿠반 프레스 | Dumbbell Cuban Press | dumbbell | review (1.15) | Cuban Press | review (0.9) | Dumbbell Bench Press
shoulders_cable_y_raise | 케이블 Y 레이즈 | Cable Y Raise | cable | review (0.9) | Front Cable Raise | review (0.9) | Cable Front Raise
shoulders_cable_single_arm_y_raise | 원암 케이블 Y 레이즈 | Single-Arm Cable Y Raise | cable | review (0.73) | Front Cable Raise | review (0.73) | Cable Front Raise
shoulders_cable_rear_delt_fly | 케이블 리어 델트 플라이 | Cable Rear Delt Fly | cable | exact (2) | Cable Rear Delt Fly | review (1.23) | Rear Delt Fly
shoulders_cable_single_arm_rear_delt_fly | 원암 케이블 리어 델트 플라이 | Single-Arm Cable Rear Delt Fly | cable | review (1.37) | Cable Rear Delt Fly | review (0.98) | Rear Delt Fly
shoulders_cable_external_rotation | 케이블 익스터널 로테이션 | Cable External Rotation | cable | review (1.22) | External Rotation with Cable | exact (2) | Cable External Rotation
shoulders_cable_face_pull | 케이블 페이스 풀 | Cable Face Pull | cable | review (0.97) | Face Pull | exact (2) | Cable Face Pull
shoulders_band_face_pull | 밴드 페이스 풀 | Band Face Pull | band | review (0.97) | Face Pull | review (0.72) | Band Pull Apart
shoulders_band_pull_apart | 밴드 풀 어파트 | Band Pull-Apart | band | exact (2) | Band Pull Apart | exact (2) | Band Pull Apart
shoulders_machine_lateral_raise | 머신 레터럴 레이즈 | Machine Lateral Raise | machine | review (1.15) | Side Lateral Raise | review (0.9) | Machine Calf Raise
shoulders_dumbbell_lateral_raise | 덤벨 사이드 레터럴 레이즈 | Dumbbell Lateral Raise | dumbbell | review (1.15) | Side Lateral Raise | exact (2) | Dumbbell Lateral Raise
shoulders_dumbbell_high_pull | 덤벨 하이 풀 | Dumbbell High Pull | dumbbell | unmatched (0.47) | Dumbbell Clean | review (0.72) | Dumbbell Bench Pull
shoulders_dumbbell_leaning_lateral_raise | 리닝 덤벨 레터럴 레이즈 | Leaning Dumbbell Lateral Raise | dumbbell | review (0.98) | Side Lateral Raise | review (1.45) | Dumbbell Lateral Raise
shoulders_dumbbell_single_arm_lateral_raise | 원암 덤벨 사이드 레터럴 레이즈 | Single-Arm Dumbbell Lateral Raise | dumbbell | review (1) | Single Dumbbell Raise | review (1.3) | Dumbbell Lateral Raise
shoulders_dumbbell_incline_lateral_raise | 인클라인 덤벨 레터럴 레이즈 | Incline Dumbbell Lateral Raise | dumbbell | review (1.18) | Dumbbell Incline Shoulder Raise | review (1.45) | Dumbbell Lateral Raise
shoulders_barbell_upright_row | 바벨 업라이트 로우 | Barbell Upright Row | barbell | review (1.4) | Upright Barbell Row | exact (2) | Barbell Upright Row
shoulders_barbell_behind_neck_press | 비하인드 넥 프레스 | Behind-the-Neck Press | barbell | review (0.98) | Neck Press | exact (2) | Behind the Neck Press
shoulders_smith_behind_neck_press | 스미스머신 비하인드 넥 프레스 | Smith Machine Behind-the-Neck Press | smith_machine | review (0.97) | Smith Machine Overhead Shoulder Press | review (0.98) | Behind the Neck Press
shoulders_smith_upright_row | 스미스머신 업라이트 로우 | Smith Machine Upright Row | smith_machine | exact (2) | Smith Machine Upright Row | exact (2) | Smith Machine Upright Row
shoulders_cable_lateral_raise | 원암 케이블 레터럴 레이즈 | Single-Arm Cable Lateral Raise | cable | review (0.9) | Cable Seated Lateral Raise | review (1.3) | Cable Lateral Raise
shoulders_cable_upright_row | 케이블 업라이트 로우 | Cable Upright Row | cable | review (1.4) | Upright Cable Row | exact (2) | Cable Upright Row
shoulders_band_lateral_raise | 밴드 레터럴 레이즈 | Band Lateral Raise | band | review (1.15) | Side Lateral Raise | review (0.58) | Side-Lying Lateral Raise
arms_machine_biceps_curl | 머신 바이셉스 컬 | Machine Biceps Curl | machine | review (0.9) | Machine Bicep Curl | review (0.9) | Machine Bicep Curl
arms_machine_preacher_curl | 머신 프리처 컬 | Machine Preacher Curl | machine | review (0.98) | Preacher Curl | exact (2) | Machine Preacher Curl
arms_dumbbell_spider_curl | 덤벨 스파이더 컬 | Dumbbell Spider Curl | dumbbell | review (0.98) | Spider Curl | review (0.98) | Spider Curl
arms_dumbbell_alternating_curl | 덤벨 얼터네이팅 컬 | Alternating Dumbbell Curl | dumbbell | review (0.9) | Seated Dumbbell Inner Biceps Curl | review (0.8) | Dumbbell Bicep Curl
arms_dumbbell_curl | 덤벨 컬 | Dumbbell Curl | dumbbell | review (1.2) | Incline Dumbbell Curl | review (1.2) | Incline Dumbbell Curl
arms_dumbbell_preacher_curl | 덤벨 프리처 컬 | Dumbbell Preacher Curl | dumbbell | review (1.2) | One Arm Dumbbell Preacher Curl | review (0.98) | Preacher Curl
arms_dumbbell_hammer_curl | 덤벨 해머 컬 | Dumbbell Hammer Curl | dumbbell | review (1) | Preacher Hammer Dumbbell Curl | exact (2) | Dumbbell Hammer Curl
arms_dumbbell_incline_curl | 인클라인 덤벨 컬 | Incline Dumbbell Curl | dumbbell | exact (2) | Incline Dumbbell Curl | exact (2) | Incline Dumbbell Curl
arms_dumbbell_zottman_curl | 조트맨 컬 | Zottman Curl | dumbbell | exact (2) | Zottman Curl | exact (2) | Zottman Curl
arms_dumbbell_concentration_curl | 컨센트레이션 컬 | Concentration Curl | dumbbell | review (0.98) | Standing Concentration Curl | exact (2) | Concentration Curl
arms_barbell_drag_curl | 바벨 드래그 컬 | Barbell Drag Curl | barbell | review (1.16) | Drag Curl | review (1.16) | Drag Curl
arms_barbell_spider_curl | 바벨 스파이더 컬 | Barbell Spider Curl | barbell | review (0.98) | Spider Curl | review (0.98) | Spider Curl
arms_barbell_curl | 바벨 컬 | Barbell Curl | barbell | exact (2) | Barbell Curl | exact (2) | Barbell Curl
arms_barbell_ez_bar_curl | 이지바 컬 | EZ-Bar Curl | barbell | exact (2) | EZ-Bar Curl | exact (2) | EZ-Bar Curl
arms_barbell_preacher_curl | 이지바 프리처 컬 | EZ-Bar Preacher Curl | barbell | review (1) | EZ-Bar Curl | review (1) | EZ-Bar Curl
arms_cable_bayesian_curl | 베이지안 케이블 컬 | Bayesian Cable Curl | cable | review (1) | Standing Biceps Cable Curl | review (1.2) | Cable Curl
arms_cable_single_arm_curl | 원암 케이블 컬 | Single-Arm Cable Curl | cable | review (0.9) | Standing Biceps Cable Curl | review (1.1) | Cable Curl
arms_cable_overhead_curl | 오버헤드 케이블 컬 | Overhead Cable Curl | cable | exact (2) | Overhead Cable Curl | review (1.2) | Cable Curl
arms_cable_rope_hammer_curl | 케이블 로프 해머 컬 | Cable Rope Hammer Curl | cable | review (0.9) | Standing Biceps Cable Curl | review (1) | Cable Hammer Curl
arms_cable_single_arm_hammer_curl | 원암 케이블 해머 컬 | Single-Arm Cable Hammer Curl | cable | review (0.83) | Standing Biceps Cable Curl | review (1.2) | Cable Hammer Curl
arms_cable_curl | 케이블 컬 | Cable Curl | cable | review (1.45) | Standing Biceps Cable Curl | exact (2) | Cable Curl
arms_cable_preacher_curl | 케이블 프리처 컬 | Cable Preacher Curl | cable | exact (2) | Cable Preacher Curl | review (0.98) | Preacher Curl
arms_cable_single_arm_preacher_curl | 원암 케이블 프리처 컬 | Single-Arm Cable Preacher Curl | cable | review (1.2) | Cable Preacher Curl | review (0.81) | Preacher Curl
arms_band_curl | 밴드 컬 | Band Curl | band | review (0.8) | Seated Band Hamstring Curl | unmatched (0.43) | Cheat Curl
arms_band_hammer_curl | 밴드 해머 컬 | Band Hammer Curl | band | review (0.73) | Seated Band Hamstring Curl | review (0.58) | Incline Hammer Curl
arms_bodyweight_dead_hang | 데드 행 | Dead Hang | bodyweight | unmatched (0.33) | Dead Bug | exact (2) | Dead Hang
arms_dumbbell_reverse_wrist_curl | 덤벨 리버스 리스트 컬 | Dumbbell Reverse Wrist Curl | dumbbell | review (1.08) | Standing Dumbbell Reverse Curl | exact (2) | Dumbbell Reverse Wrist Curl
arms_dumbbell_wrist_curl | 덤벨 리스트 컬 | Dumbbell Wrist Curl | dumbbell | review (1.07) | Palms-Down Dumbbell Wrist Curl Over A Bench | exact (2) | Dumbbell Wrist Curl
arms_dumbbell_farmer_carry | 덤벨 파머스 캐리 | Dumbbell Farmer Carry | dumbbell | unmatched (0.42) | Dumbbell Clean | review (0.62) | Dumbbell Overhead Carry
arms_dumbbell_cross_body_hammer_curl | 크로스 바디 해머 컬 | Cross-Body Hammer Curl | dumbbell | exact (2) | Cross Body Hammer Curl | exact (2) | Cross Body Hammer Curl
arms_barbell_reverse_wrist_curl | 바벨 리버스 리스트 컬 | Barbell Reverse Wrist Curl | barbell | review (1.18) | Reverse Barbell Curl | review (1) | Barbell Wrist Curl
arms_barbell_reverse_curl | 바벨 리버스 컬 | Barbell Reverse Curl | barbell | review (1.33) | Reverse Barbell Curl | review (1.16) | Reverse Curl
arms_barbell_wrist_curl | 바벨 리스트 컬 | Barbell Wrist Curl | barbell | review (1.13) | Seated Palm-Up Barbell Wrist Curl | exact (2) | Barbell Wrist Curl
arms_kettlebell_farmer_carry | 케틀벨 파머스 캐리 | Kettlebell Farmer Carry | kettlebell | unmatched (0.42) | Kettlebell Halo | review (0.62) | Kettlebell Overhead Carry
arms_plate_pinch_hold | 플레이트 핀치 홀드 | Plate Pinch Hold | plate | review (1.19) | Plate Pinch | review (1.19) | Plate Pinch
arms_other_gripper | 핸드 그리퍼 | Hand Gripper | other | unmatched (0.17) | Pushups (Close and Wide Hand Positions) | unmatched (0) | Ab Wheel Rollout
arms_bodyweight_diamond_push_up | 다이아몬드 푸쉬업 | Diamond Push-Up | bodyweight | unmatched (0.51) | Clock Push-Up | review (0.98) | Push-Up
arms_bodyweight_dip | 딥스 | Dip | bodyweight | review (0.98) | Dip Machine | unmatched (0.3) | Machine Assisted Dips
arms_bodyweight_bench_dip | 벤치 딥스 | Bench Dip | bodyweight | review (1.33) | Weighted Bench Dip | review (0.81) | Bench Dips
arms_bodyweight_close_grip_push_up | 클로즈 그립 푸쉬업 | Close-Grip Push-Up | bodyweight | review (1.08) | Close-Grip Push-Up off of a Dumbbell | review (0.81) | Push-Up
arms_machine_dip_press | 머신 딥 프레스 | Machine Dip Press | machine | review (1.07) | Dip Machine | review (0.9) | Machine Chest Press
arms_machine_triceps_extension | 머신 트라이셉스 익스텐션 | Machine Triceps Extension | machine | exact (2) | Machine Triceps Extension | exact (2) | Machine Triceps Extension
arms_machine_assisted_dip | 어시스트 딥스 | Assisted Dip | machine | unmatched (0.51) | Dip Machine | unmatched (0.55) | Machine Assisted Dips
arms_dumbbell_skull_crusher | 덤벨 스컬 크러셔 | Dumbbell Skull Crusher | dumbbell | review (1.25) | Lying Dumbbell Tricep Extension | exact (2) | Dumbbell Skull Crusher
arms_dumbbell_single_arm_skull_crusher | 원암 덤벨 스컬 크러셔 | Single-Arm Dumbbell Skull Crusher | dumbbell | review (1.08) | Lying Dumbbell Tricep Extension | review (0.96) | Single-Arm Dumbbell Overhead Tricep Extension
arms_dumbbell_overhead_triceps_extension | 덤벨 오버헤드 트라이셉스 익스텐션 | Dumbbell Overhead Triceps Extension | dumbbell | review (1) | Decline Dumbbell Triceps Extension | review (1.37) | Single-Arm Dumbbell Overhead Tricep Extension
arms_dumbbell_kickback | 덤벨 킥백 | Dumbbell Kickback | dumbbell | review (1.2) | Tricep Dumbbell Kickback | review (0.9) | Dumbbell Tricep Kickback
arms_dumbbell_single_arm_overhead_extension | 원암 덤벨 오버헤드 익스텐션 | Single-Arm Dumbbell Overhead Extension | dumbbell | review (0.97) | Dumbbell One-Arm Triceps Extension | review (1.4) | Single-Arm Dumbbell Overhead Tricep Extension
arms_barbell_jm_press | JM 프레스 | JM Press | barbell | exact (2) | JM Press | unmatched (0.51) | Arnold Press
arms_barbell_skull_crusher | 바벨 스컬 크러셔 | Barbell Skull Crusher | barbell | review (0.98) | Lying Close-Grip Barbell Triceps Extension Behind The Head | review (0.86) | Lying Tricep Extension
arms_barbell_ez_skull_crusher | 이지바 스컬 크러셔 | EZ-Bar Skull Crusher | barbell | review (0.9) | Decline EZ Bar Triceps Extension | review (1.29) | EZ-Bar Lying Triceps Extension
arms_barbell_overhead_triceps_extension | 이지바 오버헤드 트라이셉스 익스텐션 | EZ-Bar Overhead Triceps Extension | barbell | review (1.07) | Decline EZ Bar Triceps Extension | exact (2) | EZ-Bar Overhead Tricep Extension
arms_barbell_close_grip_bench_press | 클로즈 그립 벤치 프레스 | Close-Grip Bench Press | barbell | review (1.33) | Smith Machine Close-Grip Bench Press | exact (2) | Close-Grip Bench Press
arms_cable_single_arm_pushdown | 원암 케이블 푸쉬다운 | Single-Arm Cable Pushdown | cable | review (0.72) | Single-Arm Cable Crossover | unmatched (0.55) | Cable Tricep Pushdown
arms_cable_crossbody_triceps_extension | 크로스바디 케이블 트라이셉스 익스텐션 | Cross-Body Cable Triceps Extension | cable | review (0.9) | Cable Incline Triceps Extension | unmatched (0.51) | Lying Tricep Extension
arms_cable_rope_pushdown | 케이블 로프 푸쉬다운 | Cable Rope Pushdown | cable | review (0.72) | Cable Rope Overhead Triceps Extension | review (0.62) | Cable Tricep Pushdown
arms_cable_reverse_grip_pushdown | 케이블 리버스 그립 푸쉬다운 | Cable Reverse-Grip Pushdown | cable | review (0.98) | Reverse Grip Triceps Pushdown | unmatched (0.55) | Cable Tricep Pushdown
arms_cable_single_arm_reverse_grip_pushdown | 원암 케이블 리버스 그립 푸쉬다운 | Single-Arm Reverse-Grip Cable Pushdown | cable | review (0.75) | Reverse Grip Triceps Pushdown | unmatched (0.47) | Cable Tricep Pushdown
arms_cable_triceps_pushdown_straight_bar | 케이블 스트레이트바 푸쉬다운 | Cable Straight-Bar Pushdown | cable | unmatched (0.55) | Cable Incline Pushdown | review (0.65) | Straight-Bar Cable Front Raise
arms_cable_overhead_triceps_extension | 케이블 오버헤드 트라이셉스 익스텐션 | Cable Overhead Triceps Extension | cable | review (1.2) | Cable Rope Overhead Triceps Extension | review (1.23) | Overhead Tricep Extension
arms_cable_single_arm_overhead_triceps_extension | 원암 케이블 오버헤드 트라이셉스 익스텐션 | Single-Arm Cable Overhead Triceps Extension | cable | review (0.97) | Cable One Arm Tricep Extension | review (0.98) | Overhead Tricep Extension
arms_cable_triceps_kickback | 케이블 트라이셉스 킥백 | Cable Triceps Kickback | cable | review (0.8) | One-Legged Cable Kickback | review (0.9) | Cable Glute Kickback
arms_band_overhead_triceps_extension | 밴드 오버헤드 트라이셉스 익스텐션 | Band Overhead Triceps Extension | band | review (0.82) | Speed Band Overhead Triceps | review (1.23) | Overhead Tricep Extension
arms_band_triceps_pushdown | 밴드 트라이셉스 푸쉬다운 | Band Triceps Pushdown | band | review (0.97) | Triceps Pushdown | unmatched (0.42) | Band Assisted Pull Ups
abs_bodyweight_dead_bug | 데드 버그 | Dead Bug | bodyweight | exact (2) | Dead Bug | exact (2) | Dead Bug
abs_bodyweight_plank | 플랭크 | Plank | bodyweight | exact (2) | Plank | exact (2) | Plank
abs_bodyweight_plank_shoulder_tap | 플랭크 숄더 탭 | Plank Shoulder Tap | bodyweight | review (0.81) | Plank | review (0.81) | Plank
abs_bodyweight_hollow_hold | 할로우 바디 홀드 | Hollow Body Hold | bodyweight | unmatched (0.25) | Body-Up | exact (2) | Hollow Body Hold
abs_barbell_rollout | 바벨 롤아웃 | Barbell Rollout | barbell | review (1.02) | Barbell Rollout from Bench | review (0.89) | Barbell Ab Rollout
abs_cable_pallof_press | 케이블 팔로프 프레스 | Cable Pallof Press | cable | review (1.15) | Pallof Press | exact (2) | Cable Pallof Press
abs_band_pallof_press | 밴드 팔로프 프레스 | Band Pallof Press | band | review (1.15) | Pallof Press | unmatched (0.52) | Cable Pallof Press
abs_kettlebell_turkish_get_up | 터키시 겟업 | Turkish Get-Up | kettlebell | review (0.8) | Kettlebell Turkish Get-Up (Lunge style) | review (0.7) | Kettlebell Turkish Get Ups
abs_other_ab_wheel_rollout | AB휠 롤아웃 | Ab Wheel Rollout | other | unmatched (0.5) | Barbell Ab Rollout | exact (2) | Ab Wheel Rollout
abs_bodyweight_russian_twist | 러시안 트위스트 | Russian Twist | bodyweight | exact (2) | Russian Twist | exact (2) | Russian Twist
abs_bodyweight_bicycle_crunch | 바이시클 크런치 | Bicycle Crunch | bodyweight | unmatched (0.51) | Cable Crunch | exact (2) | Bicycle Crunch
abs_bodyweight_side_plank | 사이드 플랭크 | Side Plank | bodyweight | review (1.15) | Push Up to Side Plank | exact (2) | Side Plank
abs_machine_torso_rotation | 토르소 로테이션 머신 | Torso Rotation Machine | machine | review (0.97) | Torso Rotation | unmatched (0.47) | Rowing Machine
abs_dumbbell_russian_twist | 덤벨 러시안 트위스트 | Dumbbell Russian Twist | dumbbell | review (0.97) | Russian Twist | review (0.97) | Russian Twist
abs_dumbbell_side_bend | 덤벨 사이드 벤드 | Dumbbell Side Bend | dumbbell | exact (2) | Dumbbell Side Bend | exact (2) | Dumbbell Side Bend
abs_barbell_landmine_rotation | 랜드마인 로테이션 | Landmine Rotation | barbell | unmatched (0.33) | External Rotation | unmatched (0.33) | Landmine Press
abs_cable_woodchop | 케이블 우드찹 | Cable Woodchop | cable | unmatched (0.55) | Cable Crossover | unmatched (0.55) | Cable Crunch
abs_kettlebell_windmill | 케틀벨 윈드밀 | Kettlebell Windmill | kettlebell | exact (2) | Kettlebell Windmill | review (0.85) | Kettlebell Windmills
abs_plate_russian_twist | 플레이트 러시안 트위스트 | Plate Russian Twist | plate | review (0.97) | Russian Twist | review (0.97) | Russian Twist
abs_plate_side_bend | 플레이트 사이드 벤드 | Plate Side Bend | plate | unmatched (0.47) | Plate Pinch | unmatched (0.5) | Pilates Side Bend
abs_bodyweight_leg_raise | 레그 레이즈 | Leg Raise | bodyweight | review (1.33) | Hanging Leg Raise | review (1.33) | Hanging Leg Raise
abs_bodyweight_reverse_crunch | 리버스 크런치 | Reverse Crunch | bodyweight | exact (2) | Reverse Crunch | review (0.81) | Reverse Crunches
abs_bodyweight_v_up | 브이업 | V-Up | bodyweight | unmatched (0.33) | Body-Up | review (0.63) | V Ups
abs_bodyweight_sit_up | 싯업 | Sit-Up | bodyweight | exact (2) | Sit-Up | review (0.97) | Jackknife Sit-Up
abs_bodyweight_captains_chair_knee_raise | 캡틴스 체어 니 레이즈 | Captain’s Chair Knee Raise | bodyweight | review (0.69) | Hanging Leg Raise | exact (2) | Captain's Chair Knee Raise
abs_bodyweight_crunch | 크런치 | Crunch | bodyweight | review (0.98) | Cable Crunch | review (0.98) | Bicycle Crunch
abs_bodyweight_toe_touch | 토 터치 | Toe Touch Crunch | bodyweight | unmatched (0.43) | Cable Crunch | unmatched (0.43) | Bicycle Crunch
abs_bodyweight_hanging_knee_raise | 행잉 니 레이즈 | Hanging Knee Raise | bodyweight | review (1.11) | Hanging Leg Raise | exact (2) | Hanging Knee Raise
abs_bodyweight_hanging_leg_raise | 행잉 레그 레이즈 | Hanging Leg Raise | bodyweight | exact (2) | Hanging Leg Raise | exact (2) | Hanging Leg Raise
abs_machine_ab_crunch | 복근 크런치 머신 | Ab Crunch Machine | machine | exact (2) | Ab Crunch Machine | review (0.9) | Machine Seated Crunch
abs_machine_captains_chair | 캡틴스 체어 레그 레이즈 | Captain’s Chair Leg Raise | machine | review (0.76) | Hanging Leg Raise | exact (2) | Captain's Chair Leg Raise
abs_dumbbell_weighted_sit_up | 덤벨 웨이티드 싯업 | Dumbbell Weighted Sit-Up | dumbbell | review (0.8) | Sit-Up | unmatched (0.42) | Dumbbell Fly
abs_cable_standing_crunch | 스탠딩 케이블 크런치 | Standing Cable Crunch | cable | review (1.37) | Cable Crunch | review (1.37) | Cable Crunch
abs_cable_reverse_crunch | 케이블 리버스 크런치 | Cable Reverse Crunch | cable | exact (2) | Cable Reverse Crunch | review (1.07) | Cable Crunch
abs_cable_crunch | 케이블 크런치 | Cable Crunch | cable | exact (2) | Cable Crunch | exact (2) | Cable Crunch
abs_band_crunch | 밴드 크런치 | Band Crunch | band | unmatched (0.51) | Decline Crunch | unmatched (0.51) | Bicycle Crunch
abs_plate_weighted_crunch | 플레이트 웨이티드 크런치 | Plate Weighted Crunch | plate | unmatched (0.47) | Plate Pinch | review (0.68) | Weighted Wall Crunch
abs_other_roman_chair_sit_up | 로만 체어 싯업 | Roman Chair Sit-Up | other | review (0.8) | Sit-Up | unmatched (0.4) | Jackknife Sit-Up
knee_push_up | 니 푸쉬업 | Knee Push-Up | bodyweight | unmatched (0.51) | Clock Push-Up | review (0.98) | Push-Up
trap_bar_deadlift_high_handles | 트랩바 데드리프트 - 하이 핸들 | Trap-Bar Deadlift - High Handles | trap_bar | review (1.08) | Trap Bar Deadlift | unmatched (0.51) | Hex Bar Deadlift
trap_bar_deadlift_low_handles | 트랩바 데드리프트 - 로우 핸들 | Trap-Bar Deadlift - Low Handles | trap_bar | review (1.08) | Trap Bar Deadlift | unmatched (0.51) | Hex Bar Deadlift
lateral_lunge | 라테랄 런지 | Lateral Lunge | bodyweight | unmatched (0.51) | Barbell Lunge | review (0.98) | Lunge
cossack_squat | 코사크 스쿼트 | Cossack Squat | bodyweight | unmatched (0.51) | Barbell Squat | exact (2) | Cossack Squat
wall_tibialis_raise | 월 티비얼리스 레이즈 | Wall Tibialis Raise | bodyweight | unmatched (0.43) | Dumbbell Raise | unmatched (0.38) | Barbell Calf Raise
machine_tibialis_raise | 티비얼리스 레이즈 머신 | Tibialis Raise Machine | machine | review (0.8) | Smith Machine Calf Raise | review (0.9) | Machine Calf Raise
bird_dog | 버드독 | Bird Dog | bodyweight | unmatched (0) | 3/4 Sit-Up | exact (2) | Bird-Dog
copenhagen_plank | 코펜하겐 플랭크 | Copenhagen Plank | null | review (0.98) | Plank | review (0.98) | Plank
barbell_seal_row | 바벨 씰 로우 | Barbell Seal Row | barbell | review (0.9) | Upright Barbell Row | review (0.9) | Barbell Upright Row
ring_row | 링 로우 | Ring Row | gymnastic_rings | review (0.85) | Inverted Row | exact (2) | Ring Row
ring_pull_up | 링 풀업 | Ring Pull-Up | gymnastic_rings | unmatched (0.51) | Scapular Pull-Up | review (0.98) | Pull-Up
ring_dip | 링 딥스 | Ring Dip | gymnastic_rings | review (0.63) | Ring Dips | review (0.63) | Ring Dips
dumbbell_suitcase_carry | 덤벨 수트케이스 캐리 | Dumbbell Suitcase Carry | dumbbell | unmatched (0.42) | Dumbbell Clean | review (0.8) | Suitcase Carry
kettlebell_suitcase_carry | 케틀벨 수트케이스 캐리 | Kettlebell Suitcase Carry | kettlebell | unmatched (0.42) | Kettlebell Halo | review (0.8) | Suitcase Carry
reverse_nordic_curl | 리버스 노르딕 컬 | Reverse Nordic Curl | bodyweight | review (0.86) | Reverse Barbell Curl | exact (2) | Reverse Nordic Curl
box_jump | 박스 점프 | Box Jump | bodyweight | review (0.97) | Front Box Jump | exact (2) | Box Jump
bar_muscle_up | 바 머슬업 | Bar Muscle-Up | bodyweight | review (0.97) | Muscle Up | unmatched (0.5) | Ring Muscle-Up
ring_muscle_up | 링 머슬업 | Ring Muscle-Up | gymnastic_rings | review (0.97) | Muscle Up | exact (2) | Ring Muscle-Up
dragon_flag | 드래곤 플래그 | Dragon Flag | bodyweight | unmatched (0) | 3/4 Sit-Up | exact (2) | Dragon Flag
parallel_bar_l_sit | 패러럴바 L-싯 | Parallel-Bar L-Sit | bodyweight | unmatched (0.4) | Parallel Bar Dip | review (0.8) | L Sit
floor_l_sit | 플로어 L-싯 | Floor L-Sit | bodyweight | unmatched (0.25) | Floor Press | review (0.97) | L Sit
hanging_windshield_wiper | 행잉 윈드실드 와이퍼 | Hanging Windshield Wiper | bodyweight | unmatched (0.25) | Hanging Pike | unmatched (0.25) | Hanging Pike
barbell_clean | 바벨 클린 | Barbell Clean | barbell | review (0.8) | Clean | review (0.8) | Clean
barbell_power_clean | 바벨 파워 클린 | Barbell Power Clean | barbell | review (0.97) | Power Clean | review (0.63) | Clean
barbell_snatch | 바벨 스내치 | Barbell Snatch | barbell | review (0.8) | Snatch | review (0.8) | Snatch
barbell_power_snatch | 바벨 파워 스내치 | Barbell Power Snatch | barbell | review (0.97) | Power Snatch | review (0.63) | Snatch
