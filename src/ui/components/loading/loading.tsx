"use client"

import { useLoader } from './loading-context';


export default function Loading() {

    const { loading: isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black"/>
      <div className="loader"></div>
    </div>
  )
}
