import { NextRequest, NextResponse } from 'next/server'

// 宠物数据库
const PET_DATABASE = [
  {
    pet: '金毛寻回犬',
    emoji: '🐕',
    traits: '温暖治愈型 · 忠诚陪伴 · 需要运动',
    reason: '你热爱生活、重视陪伴，金毛的阳光气质和你完美契合。它会用无尽的热情填满你的每一天。',
    keywords: ['active_outdoor', 'large_space', '1_2h', 'no_allergy', 'medium_budget'],
  },
  {
    pet: '英国短毛猫',
    emoji: '🐱',
    traits: '安静治愈型 · 独立慵懒 · 适合上班族',
    reason: '你懂得享受独处时光，英短的慵懒和高冷正是你的翻版。它不需要太多照顾，但会在你需要时默默陪伴。',
    keywords: ['quiet_home', 'medium_apt', 'less_1h', 'no_allergy', 'low_budget'],
  },
  {
    pet: '布偶猫',
    emoji: '🐈',
    traits: '温柔粘人型 · 颜值担当 · 需要陪伴',
    reason: '你内心柔软，渴望羁绊，布偶猫的温顺和依赖正好满足你的情感需求。它会是你最好的毛绒室友。',
    keywords: ['quiet_home', 'medium_apt', '2_4h', 'no_allergy', 'high_budget'],
  },
  {
    pet: '仓鼠',
    emoji: '🐹',
    traits: '小巧可爱型 · 省钱省心 · 繁殖力强',
    reason: '你务实低调，不喜欢麻烦，仓鼠的超高性价比正合你意。养一对仓鼠，还能体验繁殖的乐趣！',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'mild_allergy', 'low_budget'],
  },
  {
    pet: '边境牧羊犬',
    emoji: '🐶',
    traits: '聪明绝顶型 · 精力旺盛 · 需要训练',
    reason: '你聪明好学，讨厌无聊，边牧的高智商和活力与你旗鼓相当。它会是你最好的运动搭档。',
    keywords: ['active_outdoor', 'large_space', 'more_4h', 'no_allergy', 'high_budget'],
  },
  {
    pet: '无毛猫（斯芬克斯）',
    emoji: '�猫咪',
    traits: '独特神秘型 · 亲密粘人 · 过敏友好',
    reason: '你个性独特，追求不一样的生活，斯芬克斯猫的反主流外表和深情性格专属于你。',
    keywords: ['quiet_home', 'medium_apt', '1_2h', 'strong_allergy', 'high_budget'],
  },
  {
    pet: '兔子',
    emoji: '🐰',
    traits: '软萌治愈型 · 安静乖巧 · 萌态百出',
    reason: '你内心纯真，喜欢简单的快乐，兔子的呆萌和温顺会让你每天都有好心情。',
    keywords: ['quiet_home', 'small_apt', '1_2h', 'mild_allergy', 'medium_budget'],
  },
  {
    pet: '刺猬',
    emoji: '🦔',
    traits: '独特个性型 · 夜行生物 · 害羞敏感',
    reason: '你有些神秘，不轻易展示自己，刺猬的独特气质和你如出一辙。它是你最独特的灵魂伴侣。',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'mild_allergy', 'low_budget'],
  },
]

function matchPet(answers: string[]): typeof PET_DATABASE[0] {
  // 简单匹配：根据回答找到最合适的宠物
  // 这里先用规则匹配，也可以接入 OpenClaw AI 分析
  const answerSet = new Set(answers)

  let bestMatch = PET_DATABASE[1] // 默认英短
  let bestScore = 0

  for (const pet of PET_DATABASE) {
    let score = 0
    for (const keyword of pet.keywords) {
      if (answerSet.has(keyword)) score++
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = pet
    }
  }

  return bestMatch
}

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    if (!answers || !Array.isArray(answers) || answers.length < 5) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    // 方式一：直接本地匹配（无需配置，快速可用）
    const pet = matchPet(answers)

    // 方式二：接入 OpenClaw AI（更智能，需要配置）
    // 如果配置了 OPENCLAW_GATEWAY_URL，使用 AI 分析
    const openclawUrl = process.env.OPENCLAW_GATEWAY_URL
    if (openclawUrl) {
      try {
        const openclawRes = await fetch(`${openclawUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENCLAW_API_KEY || ''}`,
          },
          body: JSON.stringify({
            model: 'MiniMax-M2.7',
            messages: [
              {
                role: 'system',
                content: `你是一个宠物性格分析师。用户回答了5个问题：${answers.join(', ')}。请分析用户的性格特征，推荐最合适的宠物（猫/狗/仓鼠/兔子等），返回一个JSON：{pet: 宠物名, emoji: 表情符号, traits: 特点描述, reason: 为什么适合}.只返回JSON，不要其他内容。`,
              },
              { role: 'user', content: '请分析并推荐' },
            ],
          }),
        })
        if (openclawRes.ok) {
          const data = await openclawRes.json()
          const content = data.choices?.[0]?.message?.content
          if (content) {
            try {
              const aiResult = JSON.parse(content)
              return NextResponse.json(aiResult)
            } catch {
              // JSON解析失败，使用本地匹配
            }
          }
        }
      } catch (e) {
        console.error('OpenClaw API error, fallback to local match:', e)
      }
    }

    return NextResponse.json(pet)
  } catch (e) {
    console.error('Quiz error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
