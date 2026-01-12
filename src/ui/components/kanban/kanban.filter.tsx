
export default function KanbanFilter() {
    return (
        <>
            <div className="w-full h-25.5 inline-block clear-both box-content"></div>
            <div className="fixed top-18 w-full flex flex-col gap-3 bg-[#1A242E] px-4 pb-4">
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#617589]">Search</span>
                    <input className="pl-10 py-2 rounded-xl w-full bg-[#2D3A4A] outline-none font-thin" type="text" placeholder="Search Client Name..." />
                </div>
                <div className="flex gap-4">
                    <button className="flex gap-2 items-center px-3 py-1 bg-[#2D3A4A] rounded-2xl border border-[#193653]">
                        <span className="material-symbols-outlined text-[18px]!">Calendar_Today</span>
                        <span className="text-white font-light">Date Range</span>
                    </button>
                    <button className="flex gap-2 items-center px-3 py-1 bg-[#2D3A4A] rounded-2xl border border-[#193653]">
                        <span className="material-symbols-outlined text-[18px]!">Payments</span>
                        <span className="text-white font-light">Value Range</span>
                    </button>
                    <button className="flex gap-2 items-center px-3 py-1 bg-[#2D3A4A] rounded-2xl border border-[#193653]">
                        <span className="material-symbols-outlined text-[18px]!">filter_list</span>
                        <span className="text-white font-light">Reset</span>
                    </button>
                </div>
            </div>
        </>
    )
}