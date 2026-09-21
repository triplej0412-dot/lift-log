import { auth } from './firebase'

export type AnalysisMode = 'latest' | 'cumulative'

export type AnalysisPayload = {
  analysisMode: AnalysisMode
  workoutData: Record<string, unknown>
}

export type AnalysisResponse = {
  summary: string
  good: string
  bad: string
  nextFocus: string
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const apiBaseUrl = (configuredBaseUrl || (import.meta.env.DEV ? '' : 'https://liftlog-ai-api.onrender.com')).replace(/\/$/, '')

export async function analyzeWorkout(payload: AnalysisPayload): Promise<AnalysisResponse> {
  const currentUser = auth.currentUser
  if (!currentUser) throw new Error('AI 분석에는 Google 로그인이 필요합니다.')

  const idToken = await currentUser.getIdToken()
  const response = await fetch(`${apiBaseUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  })
  const result = await response.json() as Partial<AnalysisResponse> & { error?: string }
  if (!response.ok) throw new Error(result.error || `분석 서버 오류 (${response.status})`)
  return {
    summary: result.summary || '',
    good: result.good || '',
    bad: result.bad || '',
    nextFocus: result.nextFocus || '',
  }
}
