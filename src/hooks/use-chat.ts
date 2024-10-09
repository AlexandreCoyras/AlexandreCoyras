import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { ChatResponseData } from "@/types/api"

export default function useChat() {
  return useMutation({
    mutationKey: ["chat"],
    mutationFn: async (messages: any[]) => {
      // const { data } = await axios.post("/api/chat", { messages })
      // return data as ChatResponseData
      return {
        message: {
          content: "Sorry, this feature is in development, come back later!",
        },
      } as ChatResponseData
    },
  })
}
