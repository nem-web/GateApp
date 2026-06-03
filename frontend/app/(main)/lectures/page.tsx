'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, FolderOpen, Play, Plus, Trash2 } from 'lucide-react'
import { GATE_EE_SUBJECTS } from '@/lib/gate-ee'

type Lecture = {
  id: string
  title: string
  subject: string
  topic?: string | null
  youtubeVideoId?: string | null
  watchedPercent: number
  completed: boolean
  durationSeconds?: number | null
}

type FolderStats = {
  name: string
  subject: string
  lectures: Lecture[]
  completed: number
  total: number
  completionPct: number
  avgWatchPct: number
  totalSeconds: number
  completedSeconds: number
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string
          events?: {
            onReady?: (event: { target: YoutubePlayer }) => void
            onStateChange?: (event: { data: number; target: YoutubePlayer }) => void
          }
          playerVars?: Record<string, unknown>
        },
      ) => YoutubePlayer
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

type YoutubePlayer = {
  destroy?: () => void
  getCurrentTime?: () => number
  getDuration?: () => number
}

function formatDuration(seconds: number) {
  if (!seconds) return 'Duration unknown'
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h ? `${h}h ${m}m` : `${m}m`
}

function videoIdFromInput(input: string) {
  try {
    const url = new URL(input)
    if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] ?? ''
    return url.searchParams.get('v') ?? input.trim()
  } catch {
    return input.includes('v=') ? input.split('v=')[1]?.split('&')[0] ?? '' : input.trim()
  }
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<string>(GATE_EE_SUBJECTS[0])
  const [youtubeLink, setYoutubeLink] = useState('')
  const [folderName, setFolderName] = useState('')
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [playlistFolder, setPlaylistFolder] = useState('')
  const [playlistStatus, setPlaylistStatus] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [activeFolder, setActiveFolder] = useState<string>('All lectures')
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null)
  const [isPlayingLecture, setIsPlayingLecture] = useState(false)
  const playerRef = useRef<YoutubePlayer | null>(null)
  const playerHostRef = useRef<HTMLDivElement | null>(null)
  const activeLectureRef = useRef<Lecture | null>(null)
  const studiedSecondsRef = useRef(0)

  useEffect(() => {
    activeLectureRef.current = activeLecture
  }, [activeLecture])

  const loadLectures = async () => {
    const res = await fetch('/api/lectures', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    const rows = Array.isArray(data.lectures) ? data.lectures : []
    const next: Lecture[] = rows.map((l: Record<string, unknown>) => ({
      id: String(l.id ?? ''),
      title: String(l.title ?? ''),
      subject: typeof l.subject === 'string' ? l.subject : 'Engineering Mathematics',
      topic: typeof l.topic === 'string' ? l.topic : null,
      youtubeVideoId: typeof l.youtubeVideoId === 'string' ? l.youtubeVideoId : null,
      watchedPercent: Number(l.watchedPercent ?? 0),
      completed: Boolean(l.completed),
      durationSeconds: typeof l.durationSeconds === 'number' ? l.durationSeconds : null,
    }))
    setLectures(next)
    setActiveLecture((current: Lecture | null) => {
      if (!current) return next[0] ?? null
      return next.find((lecture) => lecture.id === current.id) ?? next[0] ?? null
    })
  }

  useEffect(() => {
    void loadLectures()
  }, [])

  const createLecture = async () => {
    if (!title.trim()) return
    const vid = videoIdFromInput(youtubeLink)
    const res = await fetch('/api/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        subject,
        topic: folderName.trim() || 'Single lectures',
        youtubeVideoId: vid || null,
      }),
    })
    if (!res.ok) return
    setTitle('')
    setYoutubeLink('')
    await loadLectures()
  }

  const importPlaylist = async () => {
    if (!playlistUrl.trim()) return
    setImporting(true)
    setPlaylistStatus('Importing playlist...')
    try {
      const res = await fetch('/api/lectures/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistUrl,
          folderName: playlistFolder.trim() || undefined,
          subject,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setPlaylistStatus(typeof data.error === 'string' ? data.error : 'Could not import playlist.')
        return
      }
      setPlaylistStatus(`Imported ${data.imported} lectures into ${data.folderName}. Skipped ${data.skipped} duplicates.`)
      setActiveFolder(String(data.folderName ?? 'All lectures'))
      setPlaylistUrl('')
      setPlaylistFolder('')
      await loadLectures()
    } finally {
      setImporting(false)
    }
  }

  const updateProgress = async (id: string, watchedPercent: number) => {
    await fetch(`/api/lectures/${id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        watchedPercent,
        completed: watchedPercent >= 95,
      }),
    })
    await loadLectures()
  }

  const syncLectureProgress = useCallback(async (studiedSeconds = 0) => {
    const lecture = activeLectureRef.current
    const player = playerRef.current
    if (!lecture || !player || typeof player.getDuration !== 'function' || typeof player.getCurrentTime !== 'function') return

    let duration = 0
    let position = 0
    try {
      duration = Number(player.getDuration()) || 0
      position = Number(player.getCurrentTime()) || 0
    } catch {
      return
    }

    const watchedPercent = duration > 0 ? Math.min(100, Math.round((position / duration) * 100)) : lecture.watchedPercent
    await fetch(`/api/lectures/${lecture.id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        watchedPercent,
        lastPositionSeconds: Math.round(position),
        completed: watchedPercent >= 95,
        studiedSeconds,
      }),
    })
    setLectures((current) =>
      current.map((item) =>
        item.id === lecture.id
          ? { ...item, watchedPercent, completed: watchedPercent >= 95 }
          : item,
      ),
    )
    setActiveLecture((current) =>
      current?.id === lecture.id ? { ...current, watchedPercent, completed: watchedPercent >= 95 } : current,
    )
  }, [])

  useEffect(() => {
    if (!activeLecture?.youtubeVideoId) return
    setIsPlayingLecture(false)
    studiedSecondsRef.current = 0
    let cancelled = false

    const destroyPlayer = () => {
      const player = playerRef.current
      playerRef.current = null
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy()
        } catch {
          // The YouTube API can throw if React has already detached the iframe.
        }
      }
      playerHostRef.current?.replaceChildren()
    }

    const setupPlayer = () => {
      destroyPlayer()
      const host = playerHostRef.current
      const videoId = activeLectureRef.current?.youtubeVideoId
      if (cancelled || !window.YT || !host || !videoId) return

      const mount = document.createElement('div')
      mount.className = 'aspect-video w-full'
      host.replaceChildren(mount)

      playerRef.current = new window.YT.Player(mount, {
        videoId,
        playerVars: { enablejsapi: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (event) => {
            playerRef.current = event.target
          },
          onStateChange: (event) => {
            playerRef.current = event.target
            const playing = event.data === window.YT?.PlayerState.PLAYING
            setIsPlayingLecture(playing)
            if (!playing) void syncLectureProgress()
          },
        },
      })
    }

    if (window.YT?.Player) setupPlayer()
    else {
      window.onYouTubeIframeAPIReady = setupPlayer
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(script)
      }
    }

    return () => {
      cancelled = true
      void syncLectureProgress(Math.floor(studiedSecondsRef.current / 60) * 60)
      destroyPlayer()
      setIsPlayingLecture(false)
    }
  }, [activeLecture?.id, activeLecture?.youtubeVideoId, syncLectureProgress])

  useEffect(() => {
    if (!isPlayingLecture) return
    const id = window.setInterval(() => {
      studiedSecondsRef.current += 15
      const fullMinutes = Math.floor(studiedSecondsRef.current / 60) * 60
      if (fullMinutes >= 60) {
        studiedSecondsRef.current -= fullMinutes
        void syncLectureProgress(fullMinutes)
      } else {
        void syncLectureProgress()
      }
    }, 15000)
    return () => window.clearInterval(id)
  }, [isPlayingLecture, activeLecture?.id, syncLectureProgress])

  const deleteLecture = async (id: string) => {
    await fetch(`/api/lectures/${id}`, { method: 'DELETE' })
    await loadLectures()
  }

  const folders = useMemo<FolderStats[]>(() => {
    const map = new Map<string, Lecture[]>()
    for (const lecture of lectures) {
      const folder = lecture.topic?.trim() || 'Single lectures'
      if (!map.has(folder)) map.set(folder, [])
      map.get(folder)!.push(lecture)
    }
    return [...map.entries()]
      .map(([name, list]) => {
        const completed = list.filter((lecture) => lecture.completed).length
        const totalSeconds = list.reduce((sum, lecture) => sum + (lecture.durationSeconds ?? 0), 0)
        const completedSeconds = list.reduce(
          (sum, lecture) => sum + ((lecture.durationSeconds ?? 0) * Math.min(100, lecture.watchedPercent)) / 100,
          0,
        )
        return {
          name,
          subject: list[0]?.subject ?? 'GATE EE',
          lectures: list,
          completed,
          total: list.length,
          completionPct: list.length ? Math.round((completed / list.length) * 100) : 0,
          avgWatchPct: list.length ? Math.round(list.reduce((sum, lecture) => sum + lecture.watchedPercent, 0) / list.length) : 0,
          totalSeconds,
          completedSeconds,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [lectures])

  const visibleLectures = useMemo(() => {
    const folderFiltered =
      activeFolder === 'All lectures'
        ? lectures
        : lectures.filter((lecture) => (lecture.topic?.trim() || 'Single lectures') === activeFolder)
    if (filter === 'watched') return folderFiltered.filter((l) => l.completed)
    if (filter === 'unwatched') return folderFiltered.filter((l) => !l.completed)
    return folderFiltered
  }, [lectures, filter, activeFolder])

  const totalCompleted = lectures.filter((lecture) => lecture.completed).length
  const totalPct = lectures.length ? Math.round((totalCompleted / lectures.length) * 100) : 0

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Lectures</h1>
        <p className="text-muted-foreground mt-1">Playlist folders, embedded playback, and real completion tracking</p>
      </motion.div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-base font-semibold text-foreground">Add single lecture</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lecture title" className="px-3 py-2 rounded border border-border bg-input text-sm" />
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded border border-border bg-input text-sm">
              {GATE_EE_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder name" className="px-3 py-2 rounded border border-border bg-input text-sm" />
            <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="YouTube video link" className="px-3 py-2 rounded border border-border bg-input text-sm" />
          </div>
          <button onClick={createLecture} className="mt-3 inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus size={16} />Add lecture</button>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-base font-semibold text-foreground">Import YouTube playlist</h2>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input value={playlistUrl} onChange={(e) => setPlaylistUrl(e.target.value)} placeholder="Paste playlist URL with list=..." className="px-3 py-2 rounded border border-border bg-input text-sm" />
            <input value={playlistFolder} onChange={(e) => setPlaylistFolder(e.target.value)} placeholder="Folder name" className="px-3 py-2 rounded border border-border bg-input text-sm" />
          </div>
          <button onClick={importPlaylist} disabled={importing || !playlistUrl.trim()} className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60">
            {importing ? 'Importing...' : 'Import playlist'}
          </button>
          {playlistStatus && <p className="mt-2 text-xs text-muted-foreground">{playlistStatus}</p>}
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <button onClick={() => setActiveFolder('All lectures')} className={`rounded-xl border p-4 text-left ${activeFolder === 'All lectures' ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
          <p className="text-xs text-muted-foreground">Overall</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totalPct}%</p>
          <p className="text-xs text-muted-foreground">{totalCompleted}/{lectures.length} lectures complete</p>
        </button>
        {folders.map((folder) => (
          <button key={folder.name} onClick={() => setActiveFolder(folder.name)} className={`rounded-xl border p-4 text-left ${activeFolder === folder.name ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-primary" />
              <p className="truncate text-sm font-medium text-foreground">{folder.name}</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">{folder.completionPct}%</p>
            <p className="text-xs text-muted-foreground">
              {folder.completed}/{folder.total} done - {formatDuration(Math.round(folder.completedSeconds))}/{formatDuration(folder.totalSeconds)}
            </p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'watched', 'unwatched'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded text-sm ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{f}</button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          {visibleLectures.map((lecture) => (
            <div key={lecture.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground">{lecture.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{lecture.subject} - {lecture.topic || 'Single lectures'} - {formatDuration(lecture.durationSeconds ?? 0)}</p>
                </div>
                {lecture.completed ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} className="text-muted-foreground" />}
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Progress: {Math.round(lecture.watchedPercent)}%</span>
                  {lecture.durationSeconds ? <span>{formatDuration(Math.round((lecture.durationSeconds * lecture.watchedPercent) / 100))} watched</span> : null}
                </div>
                <input type="range" min={0} max={100} value={Math.round(lecture.watchedPercent)} onChange={(e) => void updateProgress(lecture.id, Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="mt-3 flex justify-between">
                <button onClick={() => setActiveLecture(lecture)} className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground"><Play size={13} />Play</button>
                <button onClick={() => void deleteLecture(lecture.id)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><Trash2 size={14} />Delete</button>
              </div>
            </div>
          ))}
          {!visibleLectures.length && (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No lectures in this view yet.
            </div>
          )}
        </div>

        <div className="sticky top-4 h-fit overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Lecture player</p>
            <p className="truncate text-xs text-muted-foreground">{activeLecture?.title ?? 'Select a lecture'}</p>
          </div>
          {activeLecture?.youtubeVideoId ? (
            <div className="bg-black">
              <div ref={playerHostRef} className="aspect-video w-full" />
              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
                <span>{isPlayingLecture ? 'Recording study time while video plays' : 'Play the video to record study time'}</span>
                <span>{Math.round(activeLecture.watchedPercent)}% watched</span>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-muted/20 px-6 text-center text-sm text-muted-foreground">
              Select a lecture with a YouTube video to play it here.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
