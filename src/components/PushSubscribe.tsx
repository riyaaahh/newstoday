'use client'

import { useEffect, useState } from 'react'

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlB64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

type State = 'idle' | 'busy' | 'on' | 'blocked' | 'unsupported'

export function PushSubscribe({
  locale,
  labels,
}: {
  locale: 'ml' | 'en'
  labels: { enable: string; on: string; blocked: string }
}) {
  const [state, setState] = useState<State>('idle')

  useEffect(() => {
    let active = true
    void (async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        if (active) setState('unsupported')
        return
      }
      if (Notification.permission === 'denied') {
        if (active) setState('blocked')
        return
      }
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = reg ? await reg.pushManager.getSubscription() : null
      if (active && sub) setState('on')
    })()
    return () => {
      active = false
    }
  }, [])

  if (!VAPID || state === 'unsupported') return null

  const subscribe = async () => {
    if (!VAPID) return
    setState('busy')
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setState('blocked')
        return
      }
      await navigator.serviceWorker.register('/sw.js')
      // Wait for an ACTIVE worker — pushManager.subscribe fails otherwise on first run.
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), locale }),
      })
      setState('on')
    } catch {
      setState('idle')
    }
  }

  if (state === 'on') return <span className="push-status">🔔 {labels.on}</span>
  if (state === 'blocked') return <span className="push-status">{labels.blocked}</span>
  return (
    <button type="button" className="push-btn" disabled={state === 'busy'} onClick={subscribe}>
      🔔 {labels.enable}
    </button>
  )
}
