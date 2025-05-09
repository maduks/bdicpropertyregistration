// import type { Metadata } from 'next'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Government Property Portal</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
