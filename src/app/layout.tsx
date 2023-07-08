import "./globals.css"

import { Inter } from "next/font/google"
import { cn } from "@lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Alexandre Coyras",
  description: "Alexandre Coyras personal website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>{children}</body>
    </html>
  )
}
