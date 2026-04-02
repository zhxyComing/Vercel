'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'

function ResultContent() {
  const params = useSearchParams()
  const pet = params.get('pet') || '神秘生物'
  const reason = params.get('reason') || '根据你的回答，你最适合养一只特别的宠物。'
  const traits = params.get('traits') || '活泼可爱'
  const emoji = params.get('emoji') || '🐾'
  const personality = params.get('personality') || '全能型'
  const difficulty = params.get('difficulty') || '★★★☆☆'
  const monthly = params.get('monthly') || '500-1000元/月'
  const compatibility = params.get('compatibility') || '95%'

  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  const handleShare = async () => {
    const shareText = `我的宠物测试结果是「${pet}」${emoji}！${reason} 快来测试你的专属萌宠 →`
    try {
      if (navigator.share) {
        await navigator.share({ title: '宠物测试', text: shareText })
      } else {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // 用户取消分享
    }
  }

  const handleRetest = () => {
    window.location.href = '/'
  }

  // 宠物分类
  const petCategory = (p: string) => {
    if (['金毛寻回犬', '边境牧羊犬', '拉布拉多'].includes(p)) return { cat: '🐕 犬类', color: '#FF9800' }
    if (['英国短毛猫', '布偶猫', '无毛猫（斯芬克斯）', '美国短毛猫'].includes(p)) return { cat: '🐈 猫类', color: '#9C27B0' }
    if (['仓鼠', '兔子'].includes(p)) return { cat: '🐹 小宠类', color: '#4CAF50' }
    return { cat: '🦔 特殊类', color: '#607D8B' }
  }

  const category = petCategory(pet)

  // 难度星级
  const renderStars = (diff: string) => {
    const match = diff.match(/★+/)?.[0] || '★★★☆☆'
    return match
  }

  return (
    <div className="container">
      {/* 彩纸特效 */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* 主结果卡片 */}
      <div className="result-card">
        <div className="result-emoji">{emoji}</div>
        <div className="result-pet-name">{pet}</div>
        <div className="result-tag" style={{ background: `${category.color}22`, color: category.color }}>
          {category.cat}
        </div>
        <p className="result-reason">{reason}</p>
      </div>

      {/* 匹配度 */}
      <div className="compatibility-box">
        <div className="compatibility-label">性格匹配度</div>
        <div className="compatibility-score">{compatibility}</div>
        <div className="compatibility-bar">
          <div className="compatibility-fill" style={{ width: compatibility, background: category.color }} />
        </div>
      </div>

      {/* 性格标签 */}
      <div className="traits-card">
        <div className="traits-title">📋 性格特征</div>
        <div className="traits-tags">
          {traits.split('·').map((tag, i) => (
            <span key={i} className="trait-tag" style={{ animationDelay: `${i * 0.1}s` }}>
              {tag.trim()}
            </span>
          ))}
        </div>
        <div className="personality-type">
          <span className="personality-label">人格类型</span>
          <span className="personality-value">{personality}</span>
        </div>
      </div>

      {/* 实用信息 */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-icon">💪</div>
          <div className="info-title">饲养难度</div>
          <div className="info-value stars">{renderStars(difficulty)}</div>
          <div className="info-sub">新手友好度</div>
        </div>
        <div className="info-card">
          <div className="info-icon">💸</div>
          <div className="info-title">月均花费</div>
          <div className="info-value">{monthly}</div>
          <div className="info-sub">食物+用品+医疗</div>
        </div>
      </div>

      {/* 分享按钮 */}
      <div className="share-section">
        <button className="share-btn" onClick={handleShare}>
          {copied ? '✅ 已复制到剪贴板' : '📤 分享给朋友'}
        </button>
      </div>

      {/* 重新测试 */}
      <button className="retest-btn" onClick={handleRetest}>
        🔄 重新测试
      </button>

      <p className="powered-by">Powered by OpenClaw AI</p>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="container"><p className="loading">加载中...</p></div>}>
      <ResultContent />
    </Suspense>
  )
}
