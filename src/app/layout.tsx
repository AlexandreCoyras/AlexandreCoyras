import "./globals.css"

import { Poppins } from "next/font/google"
import { cn } from "@lib/utils"

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
      <body className={cn(poppins.className)}>{children}</body>
    </html>
  )
}
