import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

/*
 * Expected backend hub method (NotificationHub.cs):
 *
 *   public async Task SendAlertAsync(string userId, AlertResponse alert)
 *       => await Clients.Group(userId).SendAsync("ReceiveAlert", alert);
 *
 * AlertResponse shape:
 *   { id, competitorName, alertType, message, severity, isRead, createdAt }
 *
 * Hub URL:  /hubs/notifications
 * Auth:     JWT Bearer token passed via query string (?access_token=...)
 *           configured in JwtBearerEvents.OnMessageReceived on the backend.
 */

const SEVERITY_TOAST = {
  High:   (msg) => toast.error(msg,   { duration: 6000 }),
  Medium: (msg) => toast(msg,         { duration: 5000, icon: '⚠️' }),
  Low:    (msg) => toast(msg,         { duration: 4000, icon: '🔔' }),
};

export function useSignalR() {
  const [status, setStatus]   = useState('disconnected'); // 'connected' | 'disconnected' | 'reconnecting'
  const queryClient           = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('token') ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(import.meta.env.DEV ? LogLevel.Information : LogLevel.Error)
      .build();

    // ── Event listeners ───────────────────────────────────────────────────────

    connection.on('ReceiveAlert', (alert) => {
      const severity = alert?.severity ?? 'Low';
      const message  = alert?.message
        ?? `${alert?.competitorName ?? 'Competitor'}: ${alert?.alertType ?? 'New alert'}`;

      const showToast = SEVERITY_TOAST[severity] ?? SEVERITY_TOAST.Low;
      showToast(message);

      // Invalidate so alerts list and unread badge refresh immediately
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    });

    connection.on('ConnectionEstablished', () => {
      setStatus('connected');
    });

    connection.onreconnecting(() => setStatus('reconnecting'));
    connection.onreconnected(() => setStatus('connected'));
    connection.onclose(()     => setStatus('disconnected'));

    // ── Start ─────────────────────────────────────────────────────────────────

    connection.start()
      .then(() => setStatus('connected'))
      .catch((err) => {
        console.warn('[SignalR] Connection failed:', err?.message ?? err);
        setStatus('disconnected');
      });

    // ── Cleanup ───────────────────────────────────────────────────────────────

    return () => {
      if (connection.state !== HubConnectionState.Disconnected) {
        connection.stop().catch(() => {});
      }
    };
  }, []); // run once on mount — token read inside factory so always fresh

  return { status };
}
