'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, CheckCircle2, Circle, Trash2, GripVertical, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import SidebarNav from '@/components/SidebarNav'

interface Todo {
  id: string
  task: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

const fallbackTodos: Todo[] = [
  { id: '1', task: 'Complete Graph Theory revision', priority: 'high', completed: false },
  { id: '2', task: 'Solve 20 PYQ from 2023', priority: 'medium', completed: true },
  { id: '3', task: 'Watch OS lecture on deadlocks', priority: 'low', completed: false },
  { id: '4', task: 'Practice 50 MCQs on Data Structures', priority: 'high', completed: false },
  { id: '5', task: 'Review Linear Algebra notes', priority: 'medium', completed: false },
  { id: '6', task: 'Complete DBMS normalization worksheet', priority: 'medium', completed: true },
]

const priorityColors = {
  high: { bg: 'bg-danger/15', text: 'text-danger', dot: 'bg-danger' },
  medium: { bg: 'bg-warning/15', text: 'text-warning', dot: 'bg-warning' },
  low: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
}

function mapApiTask(t: { id: string; title: string; priority: string; completed: boolean }): Todo {
  return {
    id: t.id,
    task: t.title,
    priority: t.priority as Todo['priority'],
    completed: t.completed,
  }
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      if (Array.isArray(data)) {
        setTodos(data.length ? data.map(mapApiTask) : [])
      } else {
        setTodos(fallbackTodos)
      }
    } catch {
      setTodos(fallbackTodos)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const addTodo = async () => {
    if (!newTask.trim()) return
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.trim(), priority: newPriority }),
      })
      if (res.ok) {
        const created = await res.json()
        setTodos((prev) => [mapApiTask(created), ...prev])
        toast.success('Task added')
      } else {
        const t: Todo = {
          id: `local-${Date.now()}`,
          task: newTask.trim(),
          priority: newPriority,
          completed: false,
        }
        setTodos((prev) => [t, ...prev])
        toast.message('Saved locally (database unavailable)')
      }
    } catch {
      setTodos((prev) => [
        { id: `local-${Date.now()}`, task: newTask.trim(), priority: newPriority, completed: false },
        ...prev,
      ])
      toast.error('Could not sync task')
    }
    setNewTask('')
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    const next = !completed
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: next } : todo)))
    if (id.startsWith('local-')) return
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: next }),
      })
    } catch {
      toast.error('Could not update task')
    }
  }

  const deleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    if (id.startsWith('local-')) return
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      toast.success('Task removed')
    } catch {
      toast.error('Could not delete task')
    }
  }

  const fetchAiSuggestions = async () => {
    setAiLoading(true)
    setAiSuggestion(null)
    try {
      const res = await fetch('/api/ai/task-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weakTopics: ['Graph Theory', 'TOC', 'Computer Networks'] }),
      })
      const data = await res.json()
      setAiSuggestion(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setAiSuggestion('AI unavailable. Set ANTHROPIC_API_KEY and try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.length - completedCount

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading tasks…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />

      <main className="lg:pl-[220px] pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">To-Do List</h1>
            <p className="text-muted-foreground mt-1">Stay organized and track your tasks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="bg-card border border-border rounded-xl p-4 mb-6"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                type="button"
                onClick={addTodo}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="flex items-center gap-4 mb-4"
          >
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`text-sm font-medium transition-colors ${
                filter === 'all' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({todos.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`text-sm font-medium transition-colors ${
                filter === 'active' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`text-sm font-medium transition-colors ${
                filter === 'completed' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Completed ({completedCount})
            </button>
          </motion.div>

          <Reorder.Group
            axis="y"
            values={filteredTodos}
            onReorder={(newOrder) => {
              const otherTodos = todos.filter((t) => !filteredTodos.includes(t))
              setTodos([...newOrder, ...otherTodos])
            }}
            className="space-y-2"
          >
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <Reorder.Item
                  key={todo.id}
                  value={todo}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.15 }}
                  className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={16} className="text-muted-foreground/50" />
                  <button type="button" onClick={() => toggleTodo(todo.id, todo.completed)} className="shrink-0">
                    {todo.completed ? (
                      <CheckCircle2 size={20} className="text-success" />
                    ) : (
                      <Circle size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {todo.task}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${priorityColors[todo.priority].bg} ${priorityColors[todo.priority].text}`}
                  >
                    {todo.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {filteredTodos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary" />
              <span className="text-sm font-medium text-primary">AI task ideas</span>
            </div>
            <button
              type="button"
              onClick={fetchAiSuggestions}
              disabled={aiLoading}
              className="w-full py-2.5 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-all disabled:opacity-50"
            >
              {aiLoading ? 'Thinking…' : 'Suggest tasks from weak topics'}
            </button>
            {aiSuggestion && (
              <pre className="mt-4 text-xs text-foreground/90 whitespace-pre-wrap font-sans">{aiSuggestion}</pre>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
