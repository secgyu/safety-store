import { useMutation, useQuery, useQueryClient } from '@tantml:react-query'
import { client, handleResponse } from '@/shared/lib/api-client'
import type { ActionPlan, ActionPlanRequest, SuccessResponse } from '@/shared/types/api-generated'

class ActionPlanApi {
  async getActionPlans(): Promise<ActionPlan[]> {
    const response = await client.GET('/api/action-plan')
    return handleResponse(response)
  }

  async createActionPlan(data: ActionPlanRequest): Promise<ActionPlan> {
    const response = await client.POST('/api/action-plan', { body: data })
    return handleResponse(response)
  }

  async updateActionPlan(id: string, data: Partial<ActionPlan>): Promise<ActionPlan> {
    const response = await client.PUT('/api/action-plan/{plan_id}', {
      params: { path: { plan_id: id } },
      // @ts-expect-error - Partial type mismatch
      body: data,
    })
    return handleResponse(response)
  }

  async deleteActionPlanItem(id: string, itemId: string): Promise<SuccessResponse> {
    const response = await client.DELETE('/api/action-plan/{plan_id}', {
      params: {
        path: { plan_id: id },
        query: { item_id: itemId },
      },
    })
    return handleResponse(response)
  }
}

export const actionPlanApi = new ActionPlanApi()

export function useActionPlans() {
  return useQuery({
    queryKey: ['actionPlans'],
    queryFn: actionPlanApi.getActionPlans,
  })
}

export function useCreateActionPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: actionPlanApi.createActionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] })
    },
  })
}

export function useUpdateActionPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActionPlan> }) =>
      actionPlanApi.updateActionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] })
    },
  })
}

export function useDeleteActionPlanItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, itemId }: { id: string; itemId: string }) =>
      actionPlanApi.deleteActionPlanItem(id, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] })
    },
  })
}

