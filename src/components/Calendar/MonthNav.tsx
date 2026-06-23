import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface MonthNavProps {
  currentMonth: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function MonthNav({ currentMonth, onPrev, onNext, onToday }: MonthNavProps) {
  return (
    <div className="month-nav">
      <button type="button" className="month-nav__btn" onClick={onPrev} aria-label="上个月">
        ‹
      </button>
      <div className="month-nav__center">
        <h1 className="month-nav__title">
          {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
        </h1>
        <button type="button" className="month-nav__today" onClick={onToday}>
          今天
        </button>
      </div>
      <button type="button" className="month-nav__btn" onClick={onNext} aria-label="下个月">
        ›
      </button>
    </div>
  )
}
