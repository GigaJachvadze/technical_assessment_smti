export default function Header() {
  return (
    <>
      <div className="w-full min-h-8 p-8 inline-block clear-both box-content"></div>
      <div className="flex justify-between w-screen absolute top-0 left-0 p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-2 rounded-xl shadow bg-[#192D41]"><span className="material-symbols-outlined text-white">home</span></div>
            <span>Inquiry Board</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-2 rounded-full shadow bg-[#192D41]"><span className="material-symbols-outlined text-white">Notification_Add</span></div>
          </div>
      </div>
    </>
  )
}