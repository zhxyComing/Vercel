import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// 客户端用 anon key（公开），写入操作用 service role key
export const supabase = createClient(supabaseUrl, supabaseKey)

export interface QuizRecord {
  id?: number
  answers: string[]
  pet: string
  emoji: string
  traits: string
  reason: string
  created_at?: string
}

export async function saveQuizRecord(record: Omit<QuizRecord, 'id' | 'created_at'>) {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured, skipping save')
    return null
  }
  const { data, error } = await supabase
    .from('quiz_records')
    .insert([record])
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return null
  }
  return data
}
