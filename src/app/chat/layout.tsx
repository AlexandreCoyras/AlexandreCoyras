import { Toaster } from "sonner"

export const metadata = {
  title: "Alexandre Coyras - Chat",
  description:
    "Chat with me, I'm online! I'm a french creative developer, I love to create interactive experiences with code.",
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div>
        {children}
        <Toaster />
      </div>
    </>
  )
}
