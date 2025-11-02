import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client, handleResponse } from '@/shared/lib/api-client'
import type { Notification, NotificationSettings, NotificationSettingsResponse, SuccessResponse } from '../types'

class NotificationsApi {
  async getNotifications(): Promise<Notification[]> {
    const response = await client.GET('/api/notifications')
    return handleResponse(response)
  }

  async markAsRead(id: string): Promise<SuccessResponse> {
    const response = await client.PUT('/api/notifications/{notification_id}/read', {
      params: { path: { notification_id: id } },
    })
    return handleResponse(response)
  }

  async updateSettings(data: NotificationSettings): Promise<NotificationSettingsResponse> {
    const response = await client.PUT('/api/notifications/settings', { body: data })
    return handleResponse(response)
  }
}

export const notificationsApi = new NotificationsApi()

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
    },
  })
}

