import { useMutation, useQuery } from '@tanstack/react-query'
import { client, handleResponse } from '@/shared/lib/api-client'
import type { FAQ, ContactRequest, ContactResponse, ChatRequest, ChatResponse, SuccessStory } from '../types'

class SupportApi {
  async sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await client.POST('/api/chat', { body: data })
    return handleResponse(response)
  }

  async getFAQs(): Promise<FAQ[]> {
    const response = await client.GET('/api/faq')
    return handleResponse(response)
  }

  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    const response = await client.POST('/api/support/contact', { body: data })
    return handleResponse(response)
  }

  async getSuccessStories(): Promise<SuccessStory[]> {
    const response = await client.GET('/api/success-stories')
    return handleResponse(response)
  }
}

export const supportApi = new SupportApi()

export function useSendChatMessage() {
  return useMutation({
    mutationFn: supportApi.sendChatMessage,
  })
}

export function useFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: supportApi.getFAQs,
  })
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: supportApi.submitContact,
  })
}

export function useSuccessStories() {
  return useQuery({
    queryKey: ['successStories'],
    queryFn: supportApi.getSuccessStories,
  })
}

