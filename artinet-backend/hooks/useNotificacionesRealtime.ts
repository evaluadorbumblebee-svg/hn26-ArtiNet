'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useNotificacionesRealtime(usuarioId: string) {
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [noLeidas, setNoLeidas] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setNotificaciones(data)
          setNoLeidas(data.filter((n) => !n.leida).length)
        }
      })

    const channel = supabase
      .channel('notificaciones-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificaciones',
          filter: `usuario_id=eq.${usuarioId}`,
        },
        (payload) => {
          setNotificaciones((prev) => [payload.new as any, ...prev])
          setNoLeidas((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [usuarioId])

  return { notificaciones, noLeidas }
}
