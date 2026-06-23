import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import type { DayEntry } from '../../types/entry'
import { DayCell } from './DayCell'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

interface MonthCalendarProps {
  currentMonth: Date
  entries: DayEntry[]
  onDayClick: (date: string) => void
  onStickerClick: (entry: DayEntry) => void
}

export function MonthCalendar({
  currentMonth,
  entries,
  onDayClick,
  onStickerClick,
}: MonthCalendarProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const entriesByDate = new Map<string, DayEntry[]>()
  for (const entry of entries) {
    const list = entriesByDate.get(entry.date) ?? []
    list.push(entry)
    entriesByDate.set(entry.date, list)
  }

  return (
    <div className="calendar">
      <div className="calendar__weekdays">
        {WEEKDAYS.map((label) => (
          <div key={label} className="calendar__weekday">{label}</div>
        ))}
      </div>
      <div className="calendar__grid">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          return (
            <DayCell
              key={dateStr}
              day={day}
              currentMonth={currentMonth}
              entries={entriesByDate.get(dateStr) ?? []}
              onDayClick={onDayClick}
              onStickerClick={onStickerClick}
            />
          )
        })}
      </div>
    </div>
  )
}
