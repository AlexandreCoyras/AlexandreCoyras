import '@/styles/globals.css'
import Title from "@/components/Title";

export default function App({ Component, pageProps }) {
  return <>
    <Component {...pageProps} />
    <Title/>
  </>
}
