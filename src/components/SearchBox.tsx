import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  dark: boolean
}

export function SearchBox({ value, onChange, dark }: Props) {
  return (
    <label className={`flex items-center gap-2 rounded-xl px-3 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
      <Search size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent py-3 outline-none"
        placeholder="운동명 또는 family 검색"
      />
    </label>
  )
}
