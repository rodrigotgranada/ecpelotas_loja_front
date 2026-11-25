'use client';

import { useEffect, useRef } from 'react';

export const useOrderRealtime = (onOrdersChanged: () => void) => {
  const callbackRef = useRef(onOrdersChanged);

  useEffect(() => {
    callbackRef.current = onOrdersChanged;
  }, [onOrdersChanged]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7996';
    const wsUrl = `${apiBase.replace(/^http/, 'ws').replace(/\/+$/, '')}/ws/events`;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closedByCleanup = false;

    const connect = () => {
      try {
        socket = new WebSocket(wsUrl);
        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(String(event.data || '{}')) as { topic?: string };
            if (payload.topic === 'orders') {
              callbackRef.current();
            }
          } catch {
            // ignore non-json frames
          }
        };
        socket.onclose = () => {
          if (!closedByCleanup) {
            reconnectTimer = setTimeout(connect, 5000);
          }
        };
      } catch {
        if (!closedByCleanup) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);
};
