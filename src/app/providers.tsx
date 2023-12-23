"use client"

import React from "react"
import Script from "next/script"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PH4P38V8Z0"
        ></Script>
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-PH4P38V8Z0');
          `}
        </Script>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
