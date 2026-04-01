'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResultContent() {
  const params = useSearchParams()
  const pet = params.get('pet') || '神秘生物'
  const reason = params.get('reason') || '根据你的回答，你最适合养一只特别的宠物。'
  const traits = params.get('traits') || '活泼可爱'
  const emoji = params.get('emoji') || '🐾'

  return (
    <div className="container">
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>{emoji}</div>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{pet}</h1>
      <p style={{ fontSize: '18px', color: '#667eea', fontWeight: 500, marginBottom: '24px' }}>
        最契合你的宠物
      </p>
      <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '24px' }}>
        {reason}
      </p>
      <div style={{
        background: 'linear-gradient(135deg, #667eea22, #764ba222)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>性格标签</p>
        <p style={{ fontSize: '16px', color: '#1a1a2e', fontWeight: 500 }}>{traits}</p>
      </div>
      <button
        className="option"
        onClick={() => window.location.href = '/'}
        style={{ width: '100%', textAlign: 'center', fontSize: '16px' }}
      >
        🔄 重新测试
      </button>
      <p style={{ fontSize: '12px', color: '#ccc', marginTop: '24px' }}>
        Powered by OpenClaw AI
      </p>
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
