import bodyMapHuman from '../assets/body-map-segmented-v3.png'

const labels = [['chest', '가슴'], ['back', '등'], ['legs', '하체'], ['shoulders', '어깨'], ['arms', '팔'], ['abs', '복부']] as const

const regions: Record<string, string[]> = {
  shoulders: ['M100 315 Q150 280 195 305 L175 388 L115 410 L92 365Z', 'M350 305 Q395 280 445 315 L455 365 L430 410 L370 388Z', 'M575 315 Q630 280 675 308 L650 392 L590 410 L565 365Z', 'M835 308 Q885 280 930 315 L940 365 L915 410 L855 392Z'],
  chest: ['M180 315 Q225 295 278 320 L278 418 Q222 445 165 418 L145 365Z', 'M285 320 Q338 295 385 315 L420 365 L400 418 Q343 445 285 418Z'],
  abs: ['M220 430 L278 430 L278 495 L228 495 Q215 470 220 430Z', 'M285 430 L342 430 Q348 470 335 495 L285 495Z', 'M222 502 L278 502 L278 555 L228 555 Q215 530 222 502Z', 'M285 502 L338 502 Q345 530 333 555 L285 555Z', 'M225 562 L278 562 L278 642 Q245 660 222 630Z', 'M285 562 L337 562 L340 630 Q315 660 285 642Z'],
  arms: ['M100 390 Q75 430 75 500 L105 545 L145 525 Q165 450 145 390Z', 'M75 545 L108 550 L125 690 L70 690 Q55 620 75 545Z', 'M405 390 Q425 450 445 525 L485 545 Q505 430 480 390 L440 365Z', 'M415 550 L450 545 Q470 620 455 690 L400 690Z', 'M575 390 Q550 450 570 525 L610 545 Q630 450 650 390 L610 365Z', 'M570 550 L605 545 Q625 620 610 690 L555 690Z', 'M875 390 Q895 450 915 525 L955 545 Q975 430 950 390 L910 365Z', 'M885 550 L920 545 Q940 620 925 690 L870 690Z'],
  legs: ['M140 650 Q190 625 250 665 L245 930 L215 1020 L135 970 Q115 780 140 650Z', 'M270 665 Q330 625 380 650 Q405 780 385 970 L305 1020 L275 930Z', 'M625 650 Q680 620 735 655 L735 950 L700 1020 L625 970Z', 'M755 655 Q815 620 870 650 L875 970 L800 1020 L765 950Z'],
  back: ['M650 310 Q750 275 850 310 L865 425 Q830 500 755 525 Q680 500 635 425Z']
}

type Props = {
  active: string | null
  onSelect: (part: string | null) => void
}

export function BodyMap({ active, onSelect }: Props) {
  const select = (part: string) => onSelect(active === part ? null : part)
  const region = (part: string) => regions[part].map((path, index) => (
    <path
      key={`${part}-${index}`}
      d={path}
      onClick={() => select(part)}
      style={{
        cursor: 'pointer',
        pointerEvents: 'all',
        fill: active === part ? 'rgba(173,255,47,.78)' : 'transparent',
        stroke: active === part ? '#ADFF2F' : 'transparent',
        strokeWidth: 4,
        transition: 'fill 160ms ease'
      }}
    />
  ))

  return (
    <div className="rounded-3xl border border-white/10 bg-[#151515] p-2">
      <div style={{ height: 350, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', height: '100%', aspectRatio: '2 / 3' }}>
          <img
            src={bodyMapHuman}
            alt="전면과 후면 인체 운동 부위 지도. 부위를 눌러 운동을 필터링하세요."
            style={{ display: 'block', height: '100%', width: '100%', userSelect: 'none' }}
          />
          <svg viewBox="0 0 1024 1536" style={{ position: 'absolute', inset: 0, height: '100%', width: '100%' }} aria-label="클릭 가능한 운동 부위">
            {region('shoulders')}{region('chest')}{region('abs')}{region('arms')}{region('legs')}{region('back')}
          </svg>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {labels.map(([part, label]) => (
          <button
            type="button"
            key={part}
            onClick={() => select(part)}
            className={`rounded-xl py-2 text-xs font-bold ${active === part ? 'bg-[#ADFF2F] text-black' : 'bg-white/5 text-gray-400'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
