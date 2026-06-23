'use client'

export default function NewsletterForm() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // subscribe logic
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 relative z-10"
    >
      <input
        type="email"
        placeholder="Enter your email"
        required
      />

      <button type="submit">
        Subscribe
      </button>
    </form>
  )
}