import { useState } from 'react'
import { addMonths, startOfMonth } from 'date-fns'
import type { DayEntry } from '../types/entry'
import { useEntries } from '../hooks/useEntries'
import { MonthNav } from '../components/Calendar/MonthNav'
import { MonthCalendar } from '../components/Calendar/MonthCalendar'
import { EntryModal } from '../components/EntryModal'
import { AppLayout } from '../components/AppLayout'
import { USER_COLORS } from '../constants/colors'
import { ENTRY_TYPE_LABELS } from '../types/entry'

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingEntry, setEditingEntry] = useState<DayEntry | null>(null)

  const { entries, loading, error, cloudSync, upsertEntry, deleteEntry, getEntriesForDate } =
    useEntries()

  const handleDayClick = (date: string) => {
    setEditingEntry(null)
    setSelectedDate(date)
  }

  const handleStickerClick = (entry: DayEntry) => {
    setSelectedDate(entry.date)
    setEditingEntry(entry)
  }

  const closeModal = () => {
    setSelectedDate(null)
    setEditingEntry(null)
  }

  const subtitle = (
    <>
      Ada & Ya 打卡日历
      {cloudSync && <span className="app__sync"> · 云端同步</span>}
    </>
  )

  return (
    <AppLayout title="Duo Daily" subtitle={subtitle}>
      <MonthNav
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth((m) => addMonths(m, -1))}
        onNext={() => setCurrentMonth((m) => addMonths(m, 1))}
        onToday={() => setCurrentMonth(startOfMonth(new Date()))}
      />

      {error && <p className="app__error">{error}</p>}

      {loading ? (
        <p className="app__loading">加载中…</p>
      ) : (
        <MonthCalendar
          currentMonth={currentMonth}
          entries={entries}
          onDayClick={handleDayClick}
          onStickerClick={handleStickerClick}
        />
      )}

      <section className="legend" aria-label="图例">
        <h3 className="legend__title">图例</h3>
        <div className="legend__grid">
          {(['ada', 'ya'] as const).map((userId) => (
            <div key={userId} className="legend__user">
              <span
                className="legend__user-dot"
                style={{ backgroundColor: USER_COLORS[userId].label }}
              />
              <span className="legend__user-name">{userId === 'ada' ? 'Ada' : 'Ya'}</span>
              <div className="legend__types">
                {(['study', 'exercise', 'rest'] as const).map((type) => (
                  <span key={type} className="legend__type">
                    <span
                      className="legend__type-dot"
                      style={{ backgroundColor: USER_COLORS[userId][type] }}
                    />
                    {ENTRY_TYPE_LABELS[type]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedDate && (
        <EntryModal
          date={selectedDate}
          existingEntries={getEntriesForDate(selectedDate)}
          editingEntry={editingEntry}
          onClose={closeModal}
          onSave={upsertEntry}
          onDelete={deleteEntry}
        />
      )}
    </AppLayout>
  )
}
