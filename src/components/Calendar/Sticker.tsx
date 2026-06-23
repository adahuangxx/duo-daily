import type { DayEntry } from '../../types/entry'
import { getStickerColor } from '../../constants/colors'

interface StickerProps {
  entry: DayEntry
  size?: number
  onClick?: () => void
}

export function Sticker({ entry, size = 10, onClick }: StickerProps) {
  const color = getStickerColor(entry.userId, entry.type)

  return (
    <button
      type="button"
      className="sticker"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      title={`${entry.userId === 'ada' ? 'Ada' : 'Ya'} · ${entry.type}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={`${entry.userId} ${entry.type}`}
    />
  )
}
