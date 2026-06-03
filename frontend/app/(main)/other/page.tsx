'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import * as XLSX from 'xlsx'
import { ExternalLink, FileSpreadsheet, Link as LinkIcon, Pencil, RefreshCw, Search, Trash2, UploadCloud } from 'lucide-react'

type WorkbookMeta = {
  fileName: string
  fileUrl: string
  uploadedAt: string
  sizeBytes: number
}

type ResourceCategory = 'notes' | 'practice' | 'pyq' | 'lectures' | 'tools' | 'other'

type ResourceLink = {
  id: string
  title: string
  url: string
  category: ResourceCategory
  notes: string | null
  createdAt: string
}

type CellView = {
  key: string
  value: string
  rowSpan: number
  colSpan: number
  hidden: boolean
  formula?: string
  style?: XLSX.CellObject['s']
}

const RESOURCE_CATEGORIES: Array<{ value: ResourceCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All links' },
  { value: 'notes', label: 'Notes' },
  { value: 'practice', label: 'Practice tests' },
  { value: 'pyq', label: 'PYQ tests' },
  { value: 'lectures', label: 'Lectures' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
]

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  notes: 'Notes',
  practice: 'Practice tests',
  pyq: 'PYQ tests',
  lectures: 'Lectures',
  tools: 'Tools',
  other: 'Other',
}

function columnName(index: number) {
  let name = ''
  let n = index + 1
  while (n > 0) {
    const rem = (n - 1) % 26
    name = String.fromCharCode(65 + rem) + name
    n = Math.floor((n - 1) / 26)
  }
  return name
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function worksheetCells(sheet: XLSX.WorkSheet | undefined): { rows: CellView[][]; cols: number[] } {
  if (!sheet?.['!ref']) return { rows: [], cols: [] }
  const range = XLSX.utils.decode_range(sheet['!ref'])
  const merges = sheet['!merges'] ?? []
  const hidden = new Set<string>()
  const spans = new Map<string, { rowSpan: number; colSpan: number }>()

  for (const merge of merges) {
    const start = XLSX.utils.encode_cell(merge.s)
    spans.set(start, {
      rowSpan: merge.e.r - merge.s.r + 1,
      colSpan: merge.e.c - merge.s.c + 1,
    })
    for (let r = merge.s.r; r <= merge.e.r; r++) {
      for (let c = merge.s.c; c <= merge.e.c; c++) {
        const key = XLSX.utils.encode_cell({ r, c })
        if (key !== start) hidden.add(key)
      }
    }
  }

  const rows: CellView[][] = []
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: CellView[] = []
    for (let c = range.s.c; c <= range.e.c; c++) {
      const key = XLSX.utils.encode_cell({ r, c })
      const cell = sheet[key] as XLSX.CellObject | undefined
      const span = spans.get(key) ?? { rowSpan: 1, colSpan: 1 }
      row.push({
        key,
        value: cell ? String(cell.w ?? cell.v ?? '') : '',
        formula: cell?.f,
        style: cell?.s,
        hidden: hidden.has(key),
        rowSpan: span.rowSpan,
        colSpan: span.colSpan,
      })
    }
    rows.push(row)
  }
  return {
    rows,
    cols: Array.from({ length: range.e.c - range.s.c + 1 }, (_, idx) => range.s.c + idx),
  }
}

function colorFromStyleColor(color: unknown) {
  if (!color || typeof color !== 'object') return undefined
  const row = color as { rgb?: unknown; indexed?: unknown }
  if (typeof row.rgb === 'string') {
    const rgb = row.rgb.replace(/^FF/i, '')
    return `#${rgb}`
  }
  return undefined
}

function cellStyle(style: XLSX.CellObject['s'] | undefined): React.CSSProperties {
  if (!style || typeof style !== 'object') return {}
  const s = style as {
    fill?: { fgColor?: unknown; bgColor?: unknown }
    font?: { bold?: boolean; italic?: boolean; color?: unknown }
    alignment?: { horizontal?: CSSProperties['textAlign']; vertical?: CSSProperties['verticalAlign'] }
  }
  const backgroundColor = colorFromStyleColor(s.fill?.fgColor) ?? colorFromStyleColor(s.fill?.bgColor)
  const color = colorFromStyleColor(s.font?.color)
  return {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(color ? { color } : {}),
    ...(s.font?.bold ? { fontWeight: 700 } : {}),
    ...(s.font?.italic ? { fontStyle: 'italic' } : {}),
    ...(s.alignment?.horizontal ? { textAlign: s.alignment.horizontal } : {}),
    ...(s.alignment?.vertical ? { verticalAlign: s.alignment.vertical } : {}),
  }
}

export default function OtherPage() {
  const [resourceLinks, setResourceLinks] = useState<ResourceLink[]>([])
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkCategory, setLinkCategory] = useState<ResourceCategory>('notes')
  const [linkNotes, setLinkNotes] = useState('')
  const [linkFilter, setLinkFilter] = useState<ResourceCategory | 'all'>('all')
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [linkStatus, setLinkStatus] = useState<string | null>(null)
  const [linkSaving, setLinkSaving] = useState(false)
  const [workbookMeta, setWorkbookMeta] = useState<WorkbookMeta | null>(null)
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [activeSheet, setActiveSheet] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(100)
  const [showFormulas, setShowFormulas] = useState(false)
  const [dirty, setDirty] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadLinks = async () => {
    try {
      const res = await fetch('/api/other/links', { cache: 'no-store' })
      const data = await res.json()
      setResourceLinks(Array.isArray(data.links) ? data.links : [])
      setLinkStatus(null)
    } catch {
      setResourceLinks([])
      setLinkStatus('Could not load saved links.')
    }
  }

  const parseWorkbook = async (url: string) => {
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Could not load workbook file.')
    const buffer = await res.arrayBuffer()
    const parsed = XLSX.read(buffer, { type: 'array', cellFormula: true, cellStyles: true })
    setWorkbook(parsed)
    setActiveSheet((current) => (current && parsed.SheetNames.includes(current) ? current : parsed.SheetNames[0] ?? ''))
  }

  const loadWorkbook = async () => {
    try {
      const res = await fetch('/api/other/excel', { cache: 'no-store' })
      const data = await res.json()
      const meta = data.workbook as WorkbookMeta | null
      setWorkbookMeta(meta)
      if (meta?.fileUrl) {
        await parseWorkbook(meta.fileUrl)
        setStatus(null)
      } else {
        setWorkbook(null)
        setActiveSheet('')
      }
    } catch (error) {
      setWorkbook(null)
      setActiveSheet('')
      setStatus(error instanceof Error ? `Could not read workbook: ${error.message}` : 'Could not read workbook.')
    }
  }

  useEffect(() => {
    void loadWorkbook()
    void loadLinks()
  }, [])

  const resetLinkForm = () => {
    setEditingLinkId(null)
    setLinkTitle('')
    setLinkUrl('')
    setLinkCategory('notes')
    setLinkNotes('')
  }

  const saveLink = async () => {
    if (!linkUrl.trim()) {
      setLinkStatus('Add a website link first.')
      return
    }
    setLinkSaving(true)
    setLinkStatus(editingLinkId ? 'Updating link...' : 'Saving link...')
    try {
      const res = await fetch('/api/other/links', {
        method: editingLinkId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLinkId,
          title: linkTitle,
          url: linkUrl,
          category: linkCategory,
          notes: linkNotes,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLinkStatus(typeof data.error === 'string' ? data.error : 'Could not save link.')
        return
      }
      setResourceLinks(Array.isArray(data.links) ? data.links : [])
      setLinkStatus(editingLinkId ? 'Link updated.' : 'Link saved.')
      resetLinkForm()
    } finally {
      setLinkSaving(false)
    }
  }

  const editLink = (link: ResourceLink) => {
    setEditingLinkId(link.id)
    setLinkTitle(link.title)
    setLinkUrl(link.url)
    setLinkCategory(link.category)
    setLinkNotes(link.notes ?? '')
    setLinkStatus('Editing saved link.')
  }

  const deleteLink = async (id: string) => {
    if (!window.confirm('Remove this saved link?')) return
    setLinkStatus('Removing link...')
    const res = await fetch(`/api/other/links?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setLinkStatus(typeof data.error === 'string' ? data.error : 'Could not remove link.')
      return
    }
    setResourceLinks(Array.isArray(data.links) ? data.links : [])
    if (editingLinkId === id) resetLinkForm()
    setLinkStatus('Link removed.')
  }

  const upload = async (replace = false) => {
    if (!file) return
    setStatus('Uploading workbook...')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('replace', String(replace))
    const res = await fetch('/api/other/excel', { method: 'POST', body: fd })
    const data = await res.json().catch(() => ({}))
    if (res.status === 409 && data.replaceRequired) {
      const ok = window.confirm('One Excel workbook is already uploaded. Replace it with this new file?')
      if (ok) return upload(true)
      setStatus('Upload cancelled. Existing workbook kept.')
      return
    }
    if (!res.ok) {
      setStatus(typeof data.error === 'string' ? data.error : 'Upload failed.')
      return
    }
    setFile(null)
    setStatus('Workbook uploaded.')
    await loadWorkbook()
  }

  const saveWorkbook = async (book: XLSX.WorkBook) => {
    setStatus('Autosaving...')
    const out = XLSX.write(book, { type: 'array', bookType: 'xlsx', cellStyles: true })
    const fd = new FormData()
    fd.append('file', new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), workbookMeta?.fileName ?? 'workbook.xlsx')
    const res = await fetch('/api/other/excel', { method: 'PATCH', body: fd })
    if (!res.ok) {
      setStatus('Autosave failed.')
      return
    }
    setDirty(false)
    setStatus('Autosaved.')
  }

  const scheduleSave = (book: XLSX.WorkBook) => {
    setDirty(true)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      void saveWorkbook(book)
    }, 900)
  }

  const updateCell = (cellKey: string, value: string) => {
    if (!workbook || !activeSheet) return
    const next: XLSX.WorkBook = {
      ...workbook,
      Sheets: {
        ...workbook.Sheets,
        [activeSheet]: { ...workbook.Sheets[activeSheet] },
      },
    }
    const sheet = next.Sheets[activeSheet]!
    const oldCell = sheet[cellKey] as XLSX.CellObject | undefined
    sheet[cellKey] = {
      ...(oldCell ?? {}),
      t: Number.isFinite(Number(value)) && value.trim() !== '' ? 'n' : 's',
      v: Number.isFinite(Number(value)) && value.trim() !== '' ? Number(value) : value,
      w: value,
    }
    if (!sheet['!ref']) sheet['!ref'] = cellKey
    const range = XLSX.utils.decode_range(sheet['!ref'])
    const addr = XLSX.utils.decode_cell(cellKey)
    range.s.r = Math.min(range.s.r, addr.r)
    range.s.c = Math.min(range.s.c, addr.c)
    range.e.r = Math.max(range.e.r, addr.r)
    range.e.c = Math.max(range.e.c, addr.c)
    sheet['!ref'] = XLSX.utils.encode_range(range)
    setWorkbook(next)
    scheduleSave(next)
  }

  const deleteWorkbook = async () => {
    if (!window.confirm('Remove the uploaded workbook?')) return
    await fetch('/api/other/excel', { method: 'DELETE' })
    setWorkbook(null)
    setWorkbookMeta(null)
    setActiveSheet('')
    setStatus('Workbook removed.')
  }

  const activeWorksheet = activeSheet && workbook ? workbook.Sheets[activeSheet] : undefined
  const { rows, cols } = useMemo(() => worksheetCells(activeWorksheet), [activeWorksheet])
  const normalizedSearch = search.trim().toLowerCase()
  const visibleLinks = useMemo(
    () => (linkFilter === 'all' ? resourceLinks : resourceLinks.filter((link) => link.category === linkFilter)),
    [linkFilter, resourceLinks],
  )

  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col px-4 pb-6 lg:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Other</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload one Excel workbook and view it clearly inside the website.</p>
        </div>
        {workbookMeta && (
          <button
            type="button"
            onClick={deleteWorkbook}
            className="inline-flex items-center gap-2 rounded border border-destructive/35 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Remove workbook
          </button>
        )}
      </div>

      <section className="mb-4 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Saved website links</h2>
            <p className="mt-1 text-xs text-muted-foreground">Keep notes, practice tests, PYQ tests, lectures, and useful tools in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {RESOURCE_CATEGORIES.map((category) => (
              <button
                type="button"
                key={category.value}
                onClick={() => setLinkFilter(category.value)}
                className={`rounded border px-3 py-1.5 text-xs transition-colors ${
                  linkFilter === category.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)_140px]">
          <select
            value={linkCategory}
            onChange={(e) => setLinkCategory(e.target.value as ResourceCategory)}
            className="rounded border border-border bg-input px-3 py-2 text-sm text-foreground"
          >
            {RESOURCE_CATEGORIES.filter((category) => category.value !== 'all').map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="Title, e.g. Made Easy PYQ set"
            className="rounded border border-border bg-input px-3 py-2 text-sm text-foreground"
          />
          <label className="flex items-center gap-2 rounded border border-border bg-input px-3 py-2 text-sm text-muted-foreground">
            <LinkIcon className="h-4 w-4 text-primary" />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => void saveLink()}
            disabled={linkSaving || !linkUrl.trim()}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            {linkSaving ? 'Saving...' : editingLinkId ? 'Update link' : 'Add link'}
          </button>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_140px]">
          <input
            value={linkNotes}
            onChange={(e) => setLinkNotes(e.target.value)}
            placeholder="Optional note, e.g. power systems mock tests"
            className="rounded border border-border bg-input px-3 py-2 text-sm text-foreground"
          />
          <button
            type="button"
            onClick={resetLinkForm}
            className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            Clear form
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{resourceLinks.length} saved links</span>
          {linkStatus && <span>{linkStatus}</span>}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleLinks.map((link) => (
            <div key={link.id} className="rounded-lg border border-border bg-background/45 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{link.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {CATEGORY_LABELS[link.category]} · {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => editLink(link)}
                    className="rounded border border-border p-1.5 text-muted-foreground hover:bg-secondary"
                    title="Edit link"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteLink(link.id)}
                    className="rounded border border-border p-1.5 text-muted-foreground hover:bg-secondary"
                    title="Delete link"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {link.notes && <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{link.notes}</p>}
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-2 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{link.url}</span>
              </a>
            </div>
          ))}
          {!visibleLinks.length && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No saved links in this category yet.
            </div>
          )}
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_130px_140px]">
          <label className="flex min-h-11 items-center gap-3 rounded border border-border bg-input px-3 text-sm text-muted-foreground">
            <UploadCloud className="h-4 w-4 text-primary" />
            <input
              type="file"
              accept=".xlsx,.xls,.xlsm,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="min-w-0 flex-1 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => void upload(false)}
            disabled={!file}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => void loadWorkbook()}
            className="inline-flex items-center justify-center gap-2 rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </button>
          <label className="flex items-center justify-center gap-2 rounded border border-border px-3 py-2 text-sm text-muted-foreground">
            Zoom
            <input
              type="number"
              min={60}
              max={150}
              value={zoom}
              onChange={(e) => setZoom(Math.min(150, Math.max(60, Number(e.target.value) || 100)))}
              className="w-16 rounded bg-input px-2 py-1 text-foreground"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {workbookMeta ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              {workbookMeta.fileName} · {formatBytes(workbookMeta.sizeBytes)} · uploaded{' '}
              {new Date(workbookMeta.uploadedAt).toLocaleString()}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No workbook uploaded yet.</p>
          )}
          <p className="text-sm text-muted-foreground">
            {dirty ? 'Unsaved edits pending...' : status}
          </p>
          <p className="text-xs text-muted-foreground">
            Cell edits autosave. Charts/images from Excel may not render in this browser grid, but the original workbook remains downloadable/openable.
          </p>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">
          <div className="flex max-w-full gap-2 overflow-x-auto">
            {workbook?.SheetNames.map((name) => (
              <button
                type="button"
                key={name}
                onClick={() => setActiveSheet(name)}
                className={`shrink-0 rounded px-3 py-1.5 text-xs ${
                  activeSheet === name ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 rounded border border-border bg-input px-3 py-2 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find in sheet"
                className="w-40 bg-transparent text-foreground outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showFormulas}
                onChange={(e) => setShowFormulas(e.target.checked)}
                className="accent-primary"
              />
              Formulas
            </label>
          </div>
        </div>

        {rows.length ? (
          <div className="min-h-0 flex-1 overflow-auto bg-background">
            <table
              className="border-separate border-spacing-0 text-left text-xs text-foreground"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              <thead className="sticky top-0 z-20 bg-card">
                <tr>
                  <th className="sticky left-0 z-30 min-w-12 border-b border-r border-border bg-card px-2 py-2 text-center text-muted-foreground" />
                  {cols.map((col) => (
                    <th key={col} className="min-w-28 border-b border-r border-border bg-card px-3 py-2 text-center text-muted-foreground">
                      {columnName(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    <th className="sticky left-0 z-10 border-b border-r border-border bg-card px-2 py-2 text-center text-muted-foreground">
                      {ri + 1}
                    </th>
                    {row.map((cell) => {
                      if (cell.hidden) return null
                      const display = showFormulas && cell.formula ? `=${cell.formula}` : cell.value
                      const hit = normalizedSearch && display.toLowerCase().includes(normalizedSearch)
                      return (
                        <td
                          key={cell.key}
                          rowSpan={cell.rowSpan}
                          colSpan={cell.colSpan}
                          className={`max-w-[360px] whitespace-pre-wrap border-b border-r border-border px-3 py-2 align-top focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            hit ? 'bg-primary/25 text-foreground' : cell.value ? 'bg-card/35' : 'bg-background'
                          }`}
                          style={cellStyle(cell.style)}
                          title={cell.formula ? `Formula: =${cell.formula}` : undefined}
                          contentEditable={!showFormulas}
                          suppressContentEditableWarning
                          onBlur={(e) => updateCell(cell.key, e.currentTarget.innerText)}
                        >
                          {display}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[520px] flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Upload an Excel workbook to see every sheet here with full-width scrolling.
          </div>
        )}
      </section>
    </div>
  )
}
