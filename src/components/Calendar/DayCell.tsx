import { format, isSameMonth, isToday } from 'date-fns'
import type { DayEntry } from '../../types/entry'
import { Sticker } from './Sticker'

interface DayCellProps {
  day: Date
  currentMonth: Date
  entries: DayEntry[]
  onDayClick: (date: string) => void
  onStickerClick: (entry: DayEntry) => void
}

export function DayCell({
  day,
  currentMonth,
  entries,
  onDayClick,
  onStickerClick,
}: DayCellProps) {
  const dateStr = format(day, 'yyyy-MM-dd')
  const inMonth = isSameMonth(day, currentMonth)
  const today = isToday(day)

  return (
    <button
      type="button"
      className={`day-cell${inMonth ? '' : ' day-cell--muted'}${today ? ' day-cell--today' : ''}`}
      onClick={() => onDayClick(dateStr)}
      aria-label={format(day, 'yyyy年M月d日')}
    >
      <span className="day-cell__number">{format(day, 'd')}</span>
      {entries.length > 0 && (
        <div className="day-cell__stickers">
          {entries.map((entry) => (
            <Sticker
              key={entry.id}
              entry={entry}
              onClick={() => onStickerClick(entry)}
            />
          ))}
        </div>
      )}
    </button>
  )
}
