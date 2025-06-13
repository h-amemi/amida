import { useEffect, useState } from 'react'
import { Switch } from './ui/switch'

export function ModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    const initialTheme = localStorage.getItem('theme')
    
    if (initialTheme === 'dark' || (!initialTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      root.classList.add('dark')
    } else {
      setIsDark(false)
      root.classList.remove('dark')
    }
  }, [])

  const toggleTheme = (checked: boolean) => {
    const root = window.document.documentElement
    
    setIsDark(checked)
    
    if (checked) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm">☀️</span>
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <span className="text-sm">🌙</span>
    </div>
  )
}