import "./globals.css"

import { Suspense } from "react"
import { Poppins } from "next/font/google"
import { cn } from "@lib/utils"
import { Analytics } from "@vercel/analytics/react"

import { PostHogPageview, Providers } from "@/app/providers"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

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
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <Providers>
        <body className={cn(poppins.className)}>{children}</body>
      </Providers>
      <Analytics />
    </html>
  )
}
