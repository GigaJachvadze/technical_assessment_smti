import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ModalProvider } from '@/ui/components/modal/modal-context'
import { Toaster } from 'react-hot-toast';
import { LoaderProvider } from "@/ui/components/loading/loading-context";
import Loader from "@/ui/components/loading/loading";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LoaderProvider>
      <ModalProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" />
        <Loader/>
      </ModalProvider>
    </LoaderProvider>
  )
}
