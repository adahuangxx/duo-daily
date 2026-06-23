import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { DayEntry, EntryType, UserId } from '../types/entry'
import { USERS, ENTRY_TYPE_LABELS } from '../types/entry'
import { getStickerColor } from '../constants/colors'

type Mode = 'create' | 'edit'

type Step = 'category' | 'checkin-type' | 'note'

interface EntryModalProps {
  date: string
  existingEntries: DayEntry[]
  editingEntry: DayEntry | null
  onClose: () => void
  onSave: (entry: DayEntry) => Promise<DayEntry | void>
  onDelete: (id: string) => Promise<void>
}

export function EntryModal({
  date,
  existingEntries,
  editingEntry,
  onClose,
  onSave,
  onDelete,
}: EntryModalProps) {
  const mode: Mode = editingEntry ? 'edit' : 'create'
  const [step, setStep] = useState<Step>(mode === 'edit' ? 'note' : 'category')
  const [userId, setUserId] = useState<UserId>(editingEntry?.userId ?? 'ada')
  const [entryType, setEntryType] = useState<EntryType | null>(editingEntry?.type ?? null)
  const [note, setNote] = useState(editingEntry?.note ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingEntry) {
      setUserId(editingEntry.userId)
      setEntryType(editingEntry.type)
      setNote(editingEntry.note ?? '')
      setStep('note')
    }
  }, [editingEntry])

  const dateLabel = format(parseISO(date), 'yyyy年M月d日 EEEE', { locale: zhCN })
  const userTaken = new Set(existingEntries.map((e) => e.userId))

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSelectCategory = (category: 'checkin' | 'rest') => {
    if (category === 'rest') {
      setEntryType('rest')
      setStep('note')
    } else {
      setStep('checkin-type')
    }
  }

  const handleSelectCheckinType = (type: 'study' | 'exercise') => {
    setEntryType(type)
    setStep('note')
  }

  const handleSave = async () => {
    if (!entryType) return
    setSaving(true)
    try {
      const now = new Date().toISOString()
      const entry: DayEntry = {
        id: editingEntry?.id ?? crypto.randomUUID(),
        userId,
        date,
        type: entryType,
        note: note.trim() || undefined,
        createdAt: editingEntry?.createdAt ?? now,
        updatedAt: now,
      }
      await onSave(entry)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingEntry) return
    setSaving(true)
    try {
      await onDelete(editingEntry.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const canPickUser = mode === 'create' && step === 'category'

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">{dateLabel}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        {canPickUser && (
          <div className="modal__section">
            <p className="modal__label">为谁记录？</p>
            <div className="user-picker">
              {USERS.map((user) => {
                const taken = userTaken.has(user.id) && user.id !== editingEntry?.userId
                return (
                  <button
                    key={user.id}
                    type="button"
                    className={`user-picker__btn${userId === user.id ? ' user-picker__btn--active' : ''}`}
                    style={{
                      borderColor: userId === user.id ? getStickerColor(user.id, 'study') : undefined,
                    }}
                    disabled={taken}
                    onClick={() => setUserId(user.id)}
                  >
                    {user.label}
                    {taken && <span className="user-picker__hint">已记录</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <div className="modal__section modal__summary">
            <span
              className="modal__badge"
              style={{ backgroundColor: getStickerColor(userId, entryType!) }}
            />
            <span>
              {USERS.find((u) => u.id === userId)?.label} · {ENTRY_TYPE_LABELS[entryType!]}
            </span>
          </div>
        )}

        {step === 'category' && mode === 'create' && (
          <div className="modal__section">
            <p className="modal__label">选择类型</p>
            <div className="option-grid">
              <button type="button" className="option-btn" onClick={() => handleSelectCategory('checkin')}>
                <span className="option-btn__icon">✓</span>
                <span>打卡</span>
              </button>
              <button type="button" className="option-btn" onClick={() => handleSelectCategory('rest')}>
                <span className="option-btn__icon">☁</span>
                <span>放松一天</span>
              </button>
            </div>
          </div>
        )}

        {step === 'checkin-type' && (
          <div className="modal__section">
            <p className="modal__label">打卡类型</p>
            <div className="option-grid">
              <button
                type="button"
                className="option-btn"
                style={{ borderColor: getStickerColor(userId, 'study') }}
                onClick={() => handleSelectCheckinType('study')}
              >
                <span className="option-btn__icon">📖</span>
                <span>学习</span>
              </button>
              <button
                type="button"
                className="option-btn"
                style={{ borderColor: getStickerColor(userId, 'exercise') }}
                onClick={() => handleSelectCheckinType('exercise')}
              >
                <span className="option-btn__icon">🏃</span>
                <span>锻炼</span>
              </button>
            </div>
            <button type="button" className="modal__back" onClick={() => setStep('category')}>
              返回
            </button>
          </div>
        )}

        {step === 'note' && entryType && (
          <div className="modal__section">
            {mode === 'create' && (
              <p className="modal__label">
                {entryType === 'rest'
                  ? '放松说明（可选）'
                  : '打卡说明（可选）'}
              </p>
            )}
            {mode === 'edit' && <p className="modal__label">备注</p>}
            <textarea
              className="modal__textarea"
              placeholder={
                entryType === 'rest'
                  ? '例如：身体不适，请假休息'
                  : entryType === 'study'
                    ? '例如：学了第一章'
                    : '例如：跳操一小时'
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={3}
            />
            {mode === 'create' && entryType !== 'rest' && (
              <button type="button" className="modal__back" onClick={() => setStep('checkin-type')}>
                返回
              </button>
            )}
            {mode === 'create' && entryType === 'rest' && (
              <button type="button" className="modal__back" onClick={() => setStep('category')}>
                返回
              </button>
            )}
          </div>
        )}

        <footer className="modal__footer">
          {mode === 'edit' && (
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={saving}
            >
              删除
            </button>
          )}
          <div className="modal__footer-right">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              取消
            </button>
            {step === 'note' && entryType && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '保存中…' : '保存'}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
