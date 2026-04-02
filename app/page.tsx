'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 1,
    question: '你更喜欢什么样的生活方式？',
    emoji: '🌟',
    options: [
      { text: '安静宅家，享受独处时光', value: 'quiet_home', icon: '🛋️' },
      { text: '经常户外，热爱运动旅行', value: 'active_outdoor', icon: '🏃' },
      { text: '规律作息，朝九晚五稳定', value: 'steady_routine', icon: '📅' },
      { text: '自由灵活，讨厌被约束', value: 'free_spirit', icon: '🦋' },
      { text: '社交达人，喜欢热闹聚会', value: 'social_butterfly', icon: '🎉' },
      { text: '工作狂，经常加班出差', value: 'work_aholic', icon: '💼' },
    ]
  },
  {
    id: 2,
    question: '你的居住环境是？',
    emoji: '🏠',
    options: [
      { text: '独栋别墅，带院子或花园', value: 'large_space', icon: '🏡' },
      { text: '普通公寓，空间适中', value: 'medium_apt', icon: '🏢' },
      { text: '小户型，收纳空间有限', value: 'small_apt', icon: '🪑' },
      { text: '合租房，需要室友同意', value: 'shared_apt', icon: '🚪' },
      { text: '和家人同住，空间宽敞', value: 'family_home', icon: '👨‍👩‍👧' },
      { text: '宿舍或学生公寓', value: 'dorm', icon: '🏫' },
    ]
  },
  {
    id: 3,
    question: '你每天能花多少时间照顾宠物？',
    emoji: '⏰',
    options: [
      { text: '少于1小时，比较忙', value: 'less_1h', icon: '⏱️' },
      { text: '1-2小时，可以接受', value: '1_2h', icon: '⏰' },
      { text: '2-4小时，时间充裕', value: '2_4h', icon: '🕐' },
      { text: '4小时以上，全职陪伴', value: 'more_4h', icon: '💖' },
      { text: '碎片时间，偶尔陪玩', value: '碎片时间', icon: '🧩' },
    ]
  },
  {
    id: 4,
    question: '你对宠物毛发过敏吗？',
    emoji: '🤧',
    options: [
      { text: '完全不影响', value: 'no_allergy', icon: '✅' },
      { text: '轻微敏感，可接受短毛', value: 'mild_allergy', icon: '😐' },
      { text: '比较敏感，需要无毛品种', value: 'strong_allergy', icon: '🤧' },
      { text: '过敏严重，完全无法靠近', value: 'severe_allergy', icon: '🚫' },
    ]
  },
  {
    id: 5,
    question: '你养宠物的预算是？',
    emoji: '💰',
    options: [
      { text: '越便宜越好，控制成本', value: 'low_budget', icon: '💵' },
      { text: '适中，月花500内', value: 'medium_budget', icon: '💴' },
      { text: '愿意投入，不设上限', value: 'high_budget', icon: '💎' },
      { text: '一次性投入，长期摊销', value: 'one_time', icon: '🏦' },
      { text: '能省则省，但必要时会花', value: 'budget_aware', icon: '🧮' },
    ]
  },
  {
    id: 6,
    question: '你家里有小孩或其他宠物吗？',
    emoji: '👨‍👩‍👧',
    options: [
      { text: '家里有小朋友（<6岁）', value: 'has_young_kids', icon: '👶' },
      { text: '家里有大孩子（>6岁）', value: 'has_older_kids', icon: '🧒' },
      { text: '家里有老人同住', value: 'has_elderly', icon: '👴' },
      { text: '已养其他宠物（猫/狗/鱼等）', value: 'has_other_pets', icon: '🐠' },
      { text: '独居，只有我自己', value: 'single_person', icon: '🙋' },
      { text: '两人世界，暂无小孩', value: 'couple_no_kids', icon: '💑' },
    ]
  },
  {
    id: 7,
    question: '你对宠物带来的麻烦容忍度是？',
    emoji: '🧹',
    options: [
      { text: '完全无法接受任何异味/掉毛', value: 'zero_tolerance', icon: '😷' },
      { text: '轻度可以接受，需要勤打扫', value: 'mild_tolerance', icon: '🧽' },
      { text: '无所谓，毛孩子们最重要', value: 'fully_tolerant', icon: '😍' },
      { text: '可以接受，但希望别太闹', value: 'noise_sensitive', icon: '🤫' },
      { text: '能接受破坏家具/抓沙发', value: 'scratch_ok', icon: '🛋️' },
    ]
  },
  {
    id: 8,
    question: '你经常出差或旅行吗？',
    emoji: '✈️',
    options: [
      { text: '基本不出差，朝九晚五', value: 'rarely_travel', icon: '🏠' },
      { text: '偶尔出差，3-5天/月', value: 'sometimes_travel', icon: '📆' },
      { text: '经常出差，常驻在外', value: 'often_travel', icon: '🛫' },
      { text: '自由职业，随时能带宠物', value: 'freelance', icon: '💻' },
      { text: '有家人可以帮忙照看', value: 'family_help', icon: '👨‍👩‍👧' },
    ]
  },
]

export default function QuizPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  const question = QUESTIONS[current]
  const totalQuestions = QUESTIONS.length
  const progress = ((current) / totalQuestions) * 100

  const handleSelect = (value: string) => {
    if (isAnimating) return
    setSelectedValue(value)
    setIsAnimating(true)

    // 动画延迟后进入下一题
    setTimeout(() => {
      const newAnswers = [...answers, value]
      setAnswers(newAnswers)
      setSelectedValue(null)
      setIsAnimating(false)

      if (current < totalQuestions - 1) {
        setCurrent(current + 1)
      } else {
        // 提交
        setIsSubmitting(true)
        submitAnswers(newAnswers)
      }
    }, 300)
  }

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1)
      setAnswers(answers.slice(0, -1))
    }
  }

  const submitAnswers = async (finalAnswers: string[]) => {
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      const data = await res.json()
      const params = new URLSearchParams({
        pet: data.pet || '',
        reason: data.reason || '',
        traits: data.traits || '',
        emoji: data.emoji || '🐾',
        personality: data.personality || '',
        difficulty: data.difficulty || '',
        monthly: data.monthly || '',
        compatibility: data.compatibility || '',
      })
      router.push(`/result?${params.toString()}`)
    } catch (e) {
      console.error('Submit failed:', e)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      {/* 顶部标题 */}
      <div className="header">
        <h1>🐾 最契合你的宠物</h1>
        <p className="subtitle">答完{totalQuestions}题，揭晓你的专属萌宠</p>
      </div>

      {/* 进度条 */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* 进度点 */}
      <div className="progress-dots">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`dot ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* 进度文字 */}
      <div className="progress-text">
        第 {current + 1} / {totalQuestions} 题
      </div>

      {isSubmitting ? (
        <div className="loading">
          <div className="loading-icon">🔮</div>
          <p>AI 正在分析你的性格</p>
          <p className="loading-sub">请稍候...</p>
        </div>
      ) : (
        <>
          {/* 问题 */}
          <div className={`question-block ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            <div className="question-emoji">{question.emoji}</div>
            <h2 className="question">{question.question}</h2>

            {/* 选项 */}
            <div className="options">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  className={`option ${selectedValue === opt.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                  disabled={isAnimating}
                >
                  <span className="option-icon">{opt.icon}</span>
                  <span className="option-text">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 返回按钮 */}
          {current > 0 && (
            <button className="back-btn" onClick={handleBack}>
              ← 上一题
            </button>
          )}
        </>
      )}
    </div>
  )
}
