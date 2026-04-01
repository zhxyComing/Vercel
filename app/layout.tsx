import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '最契合你的宠物',
  description: '通过5道题，找到最适合你的宠物伙伴',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
