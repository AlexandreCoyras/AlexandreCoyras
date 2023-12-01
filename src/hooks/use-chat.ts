import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export default function useChat() {
  return useMutation({
    mutationKey: ["chat"],
    mutationFn: async (messages: string[]) => {
      const { data } = await axios.post("/api/chat", { messages })
      return data
    },
  })
}
