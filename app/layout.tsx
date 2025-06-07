import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SkyeGUI',
  keywords: [
    'SkyeGUI',
    'Minecraft Server GUI',
    'Minecraft Server Management',
    'Minecraft Server Control Panel',
    'Minecraft Server Dashboard',
    'Minecraft Server',
    'Minecraft Control Panel',
    'Minecraft Dashboard',
    'Minecraft Server Control',
    'Minecraft Server Management GUI',
    'Minecraft Server Management Panel',
    'Minecraft',
    'GUI',
    'Server Management',
    'Java',
    'Bedrock',
    'Nobleskye',
    'Nobleskye.dev',
    'Minecraft GUI',
    'Minecraft Server Management Dashboard',
  ],
  authors: [
    {
      name: 'Nobleskye',
      url: 'https://nobleskye.dev',
    },
  ],
  openGraph: {
    title: 'SkyeGUI - Minecraft Server GUI',
    description: 'Create GUI for Minecraft servers with ease',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
