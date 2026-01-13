export default function Header() {
  return (
    <>
      <div className="w-full min-h-16 py-1 inline-block clear-both box-content"></div>
      <div className="flex z-10 justify-between w-full absolute top-0 left-0 p-4 bg-[#1A242E]">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-2 rounded-xl shadow bg-[#192D41]"><span className="material-symbols-outlined text-[#137FEC]">Widgets</span></div>
            <span>Inquiry Board</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-2 rounded-full shadow bg-[#192D41]"><span className="material-symbols-outlined text-white">Notification_Add</span></div>
          </div>
      </div>
    </>
  )
}