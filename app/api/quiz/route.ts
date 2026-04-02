import { NextRequest, NextResponse } from 'next/server'
import { saveQuizRecord } from '@/lib/supabase'

// 宠物数据库（扩展版）
const PET_DATABASE = [
  {
    pet: '金毛寻回犬',
    emoji: '🐕',
    traits: '温暖治愈型 · 忠诚陪伴 · 需要运动',
    reason: '你热爱生活、重视陪伴，金毛的阳光气质和你完美契合。它会用无尽的热情填满你的每一天。',
    keywords: ['active_outdoor', 'large_space', '1_2h', 'no_allergy', 'medium_budget'],
    personality: '温暖治愈型',
    difficulty: '★★★☆☆',
    monthly: '800-1500元/月',
  },
  {
    pet: '英国短毛猫',
    emoji: '🐱',
    traits: '安静治愈型 · 独立慵懒 · 适合上班族',
    reason: '你懂得享受独处时光，英短的慵懒和高冷正是你的翻版。它不需要太多照顾，但会在你需要时默默陪伴。',
    keywords: ['quiet_home', 'medium_apt', 'less_1h', 'no_allergy', 'low_budget'],
    personality: '独立悠然型',
    difficulty: '★☆☆☆☆',
    monthly: '300-600元/月',
  },
  {
    pet: '布偶猫',
    emoji: '🐈',
    traits: '温柔粘人型 · 颜值担当 · 需要陪伴',
    reason: '你内心柔软，渴望羁绊，布偶猫的温顺和依赖正好满足你的情感需求。它会是你最好的毛绒室友。',
    keywords: ['quiet_home', 'medium_apt', '2_4h', 'no_allergy', 'high_budget'],
    personality: '温柔粘人型',
    difficulty: '★★☆☆☆',
    monthly: '600-1200元/月',
  },
  {
    pet: '边境牧羊犬',
    emoji: '🐶',
    traits: '聪明绝顶型 · 精力旺盛 · 需要训练',
    reason: '你聪明好学，讨厌无聊，边牧的高智商和活力与你旗鼓相当。它会是你最好的运动搭档。',
    keywords: ['active_outdoor', 'large_space', 'more_4h', 'no_allergy', 'high_budget'],
    personality: '活力挑战型',
    difficulty: '★★★★☆',
    monthly: '1000-2000元/月',
  },
  {
    pet: '无毛猫（斯芬克斯）',
    emoji: '🐱',
    traits: '独特神秘型 · 亲密粘人 · 过敏友好',
    reason: '你个性独特，追求不一样的生活，斯芬克斯猫的反主流外表和深情性格专属于你。',
    keywords: ['quiet_home', 'medium_apt', '1_2h', 'strong_allergy', 'high_budget'],
    personality: '独特神秘型',
    difficulty: '★★★☆☆',
    monthly: '800-1500元/月',
  },
  {
    pet: '仓鼠',
    emoji: '🐹',
    traits: '小巧可爱型 · 省钱省心 · 繁殖力强',
    reason: '你务实低调，不喜欢麻烦，仓鼠的超高性价比正合你意。养一对仓鼠，还能体验繁殖的乐趣！',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'mild_allergy', 'low_budget'],
    personality: '务实简约型',
    difficulty: '★☆☆☆☆',
    monthly: '100-300元/月',
  },
  {
    pet: '兔子',
    emoji: '🐰',
    traits: '软萌治愈型 · 安静乖巧 · 萌态百出',
    reason: '你内心纯真，喜欢简单的快乐，兔子的呆萌和温顺会让你每天都有好心情。',
    keywords: ['quiet_home', 'small_apt', '1_2h', 'mild_allergy', 'medium_budget'],
    personality: '软萌治愈型',
    difficulty: '★★☆☆☆',
    monthly: '200-500元/月',
  },
  {
    pet: '刺猬',
    emoji: '🦔',
    traits: '独特个性型 · 夜行生物 · 害羞敏感',
    reason: '你有些神秘，不轻易展示自己，刺猬的独特气质和你如出一辙。它是你最独特的灵魂伴侣。',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'mild_allergy', 'low_budget'],
    personality: '神秘内敛型',
    difficulty: '★★★☆☆',
    monthly: '200-400元/月',
  },
  {
    pet: '拉布拉多猎犬',
    emoji: '🦮',
    traits: '友善外向型 · 服从性强 · 食欲旺盛',
    reason: '你热情开朗，喜欢交朋友，拉拉的友善和忠诚会让你成为朋友圈最受羡慕的铲屎官！',
    keywords: ['active_outdoor', 'large_space', '2_4h', 'no_allergy', 'medium_budget'],
    personality: '热情社交型',
    difficulty: '★★☆☆☆',
    monthly: '800-1500元/月',
  },
  {
    pet: '美国短毛猫',
    emoji: '🐈‍⬛',
    traits: '活泼健康型 · 好奇心重 · 体质强健',
    reason: '你活泼有趣，喜欢探索，美短的健康体质和好奇心正好匹配你的生活方式。',
    keywords: ['quiet_home', 'medium_apt', '1_2h', 'no_allergy', 'medium_budget'],
    personality: '活泼探索型',
    difficulty: '★☆☆☆☆',
    monthly: '400-800元/月',
  },
  {
    pet: '柴犬',
    emoji: '🐕‍🦺',
    traits: '倔强傲娇型 · 表情丰富 · 掉毛严重',
    reason: '你有主见有个性，柴犬的倔强和表情包体质跟你的性格完美match！',
    keywords: ['active_outdoor', 'medium_apt', '1_2h', 'no_allergy', 'medium_budget'],
    personality: '傲娇独立型',
    difficulty: '★★★★☆',
    monthly: '600-1200元/月',
  },
  {
    pet: '龙猫（毛丝鼠）',
    emoji: '🐁',
    traits: '治愈系毛球 · 夜行性 · 寿命超长',
    reason: '你追求品质生活，龙猫的超高颜值和超长寿命能陪伴你很多很多年。',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'mild_allergy', 'medium_budget'],
    personality: '品质生活型',
    difficulty: '★★☆☆☆',
    monthly: '300-600元/月',
  },
  {
    pet: '柯基犬',
    emoji: '🐾',
    traits: '呆萌逗比型 · 小短腿 · 电屁股',
    reason: '你幽默风趣，喜欢快乐，柯基的呆萌和魔性屁股会让你每天都笑出声！',
    keywords: ['active_outdoor', 'medium_apt', '2_4h', 'no_allergy', 'high_budget'],
    personality: '快乐逗比型',
    difficulty: '★★★☆☆',
    monthly: '800-1500元/月',
  },
  {
    pet: '守宫（豹纹蜥蜴）',
    emoji: '🦎',
    traits: '冷酷爬宠型 · 打理简单 · 观赏性强',
    reason: '你特立独行，喜欢小众，守宫省心又独特，绝对让你在爬宠圈站稳脚跟。',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'strong_allergy', 'low_budget'],
    personality: '冷峻小众型',
    difficulty: '★☆☆☆☆',
    monthly: '100-300元/月',
  },
  {
    pet: '玄凤鹦鹉',
    emoji: '🦜',
    traits: '歌唱天才型 · 粘人撒娇 · 会吹口哨',
    reason: '你热爱音乐，喜欢互动，玄凤的歌声和可爱模样会让你的家充满欢乐。',
    keywords: ['quiet_home', 'medium_apt', '1_2h', 'no_allergy', 'medium_budget'],
    personality: '音乐活泼型',
    difficulty: '★★★☆☆',
    monthly: '300-700元/月',
  },
  {
    pet: '斗鱼',
    emoji: '🐟',
    traits: '水中贵族型 · 华丽飘逸 · 领地意识强',
    reason: '你追求美感，注重格调，斗鱼的华丽尾鳍和优雅游姿是桌面最美的风景线。',
    keywords: ['quiet_home', 'small_apt', 'less_1h', 'severe_allergy', 'low_budget'],
    personality: '精致典雅型',
    difficulty: '★☆☆☆☆',
    monthly: '50-200元/月',
  },
]

// 所有合法的答案值（扩展版）
const VALID_ANSWERS = new Set([
  // Q1: 生活方式的
  'quiet_home', 'active_outdoor', 'steady_routine', 'free_spirit', 'social_butterfly', 'work_aholic',
  // Q2: 居住环境
  'large_space', 'medium_apt', 'small_apt', 'shared_apt', 'family_home', 'dorm',
  // Q3: 照顾时间
  'less_1h', '1_2h', '2_4h', 'more_4h', '碎片时间',
  // Q4: 过敏
  'no_allergy', 'mild_allergy', 'strong_allergy', 'severe_allergy',
  // Q5: 预算
  'low_budget', 'medium_budget', 'high_budget', 'one_time', 'budget_aware',
  // Q6: 家庭情况
  'has_young_kids', 'has_older_kids', 'has_elderly', 'has_other_pets', 'single_person', 'couple_no_kids',
  // Q7: 麻烦容忍度
  'zero_tolerance', 'mild_tolerance', 'fully_tolerant', 'noise_sensitive', 'scratch_ok',
  // Q8: 出行频率
  'rarely_travel', 'sometimes_travel', 'often_travel', 'freelance', 'family_help',
])

function matchPet(answers: string[]) {
  const answerSet = new Set(answers)

  let bestMatch = PET_DATABASE[1]
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

  // 计算匹配度百分比
  const matchPercent = Math.min(98, 60 + bestScore * 8)
  ;(bestMatch as any).compatibility = `${matchPercent}%`

  return bestMatch as any
}

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    // 严格验证：类型 + 长度 + 值的合法性
    if (
      !answers ||
      !Array.isArray(answers) ||
      answers.length !== 8 ||
      !answers.every((a: unknown) => typeof a === 'string' && VALID_ANSWERS.has(a))
    ) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    const pet = matchPet(answers)

    // OpenClaw AI 分析（可选）
    const openclawUrl = process.env.OPENCLAW_GATEWAY_URL
    let result = pet

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
                content: `你是一个宠物性格分析师。用户回答了8个问题：${answers.join(', ')}。请分析用户的性格特征，推荐最合适的宠物（猫/狗/仓鼠/兔子等），返回一个JSON：{pet: 宠物名, emoji: 表情符号, traits: 特点描述, reason: 为什么适合, personality: 人格类型描述, difficulty: 饲养难度星级如★★★☆☆, monthly: 月均花费}.只返回JSON，不要其他内容。`,
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
              result = { ...aiResult, compatibility: pet.compatibility }
            } catch {
              // JSON解析失败，使用本地匹配
            }
          }
        }
      } catch (e) {
        console.error('OpenClaw API error, fallback to local match:', e)
      }
    }

    // 保存到数据库（异步，不阻塞返回）
    saveQuizRecord({
      answers,
      pet: result.pet,
      emoji: result.emoji,
      traits: result.traits,
      reason: result.reason,
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error('Quiz error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
