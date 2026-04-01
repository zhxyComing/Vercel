'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 1,
    question: '你更喜欢什么样的生活方式？',
    options: [
      { text: '安静宅家，享受独处时光', value: 'quiet_home' },
      { text: '经常户外，热爱运动旅行', value: 'active_outdoor' },
      { text: '规律作息，朝九晚五稳定', value: 'steady_routine' },
      { text: '自由灵活，讨厌被约束', value: 'free_spirit' },
    ]
  },
  {
    id: 2,
    question: '你的居住环境是？',
    options: [
      { text: '大房子，带院子或花园', value: 'large_space' },
      { text: '普通公寓，空间适中', value: 'medium_apt' },
      { text: '小户型，收纳空间有限', value: 'small_apt' },
      { text: '合租房，需要室友同意', value: 'shared_apt' },
    ]
  },
  {
    id: 3,
    question: '你每天能花多少时间照顾宠物？',
    options: [
      { text: '少于1小时，比较忙', value: 'less_1h' },
      { text: '1-2小时，可以接受', value: '1_2h' },
      { text: '2-4小时，时间充裕', value: '2_4h' },
      { text: '4小时以上，全职陪伴', value: 'more_4h' },
    ]
  },
  {
    id: 4,
    question: '你对宠物毛发过敏吗？',
    options: [
      { text: '完全不影响', value: 'no_allergy' },
      { text: '轻微敏感，可接受短毛', value: 'mild_allergy' },
      { text: '比较敏感，需要无毛品种', value: 'strong_allergy' },
    ]
  },
  {
    id: 5,
    question: '你养宠物的预算是？',
    options: [
      { text: '越便宜越好，控制成本', value: 'low_budget' },
      { text: '适中，平均月花500内', value: 'medium_budget' },
      { text: '愿意投入，不设上限', value: 'high_budget' },
    ]
  },
]

export default function QuizPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const question = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  const handleSelect = async (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1)
    } else {
      // Last question - submit
      setIsSubmitting(true)
      try {
        const res = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        })
        const data = await res.json()
        // Navigate to result page with result data
        const params = new URLSearchParams({
          pet: data.pet || '',
          reason: data.reason || '',
          traits: data.traits || '',
          emoji: data.emoji || '🐾',
        })
        router.push(`/result?${params.toString()}`)
      } catch (e) {
        console.error('Submit failed:', e)
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="container">
      <h1>🐾 最契合你的宠物</h1>
      <p className="subtitle">答完5题，揭晓答案</p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {isSubmitting ? (
        <div className="loading">
          <p>AI 正在分析你的性格<span className="loading-dots"></span></p>
        </div>
      ) : (
        <>
          <h2 className="question">{question.question}</h2>
          <div className="options">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                className="option"
                onClick={() => handleSelect(opt.value)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
