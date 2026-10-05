import { useEffect, useState } from 'react'
import { site } from '@/data/site'

export interface OpenStatus {
  open: boolean
  label: string
}

function compute(now = new Date()): OpenStatus {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Manila' }).format(now),
  ) % 24
  const open = hour >= site.hours.open && hour < site.hours.close
  return open
    ? { open: true, label: 'Open now, until 10pm' }
    : { open: false, label: hour < site.hours.open ? 'Opens at 8am' : 'Closed, opens 8am' }
}

export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>(() => compute())
  useEffect(() => {
    const id = window.setInterval(() => setStatus(compute()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}
