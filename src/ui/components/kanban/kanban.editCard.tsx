import { useState } from "react";
import { kanbanCard } from "./model";
import { formatDateShort } from "@/helper/dateFormat";

type KanbanEditCardProps = {
    selectedColumn: string | null;
    card?: kanbanCard;
    onAction: (card: kanbanCard) => void;
    onClose: () => void;
};

export default function KanbanEditCard({ selectedColumn, card, onAction, onClose }: KanbanEditCardProps) {
    const [editCard, seteditCard] = useState<kanbanCard>(card? card : {} as kanbanCard);

    return (
        <div className="flex flex-col gap-4 bg-[#1A242E] rounded-lg">
            <div>
                <h2 className="text-lg font-bold text-white">{selectedColumn ? "Create Inquery" : "Edit Inquery"}</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Client Name</label>
                    <input value={editCard.clientName ?? ''} onChange={(e) => seteditCard({...editCard, clientName: e.target.value})} type="text" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Contact Person</label>
                    <input value={editCard.contactPerson ?? ''} onChange={(e) => seteditCard({...editCard, contactPerson: e.target.value})} type="text" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Event Type</label>
                    <input value={editCard.eventType ?? ''} onChange={(e) => seteditCard({...editCard, eventType: e.target.value})} type="text" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Potential Value (CHF)</label>
                    <input value={editCard.potentialValue ?? ''} onChange={(e) => seteditCard({...editCard, potentialValue: parseInt(e.target.value)})} type="number" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Event Date</label>
                    <input value={editCard.eventDate ?? ''} onChange={(e) => seteditCard({...editCard, eventDate: e.target.value})} type="date" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Guest Count</label>
                    <input value={editCard.guestCount ?? ''} onChange={(e) => seteditCard({...editCard, guestCount: parseInt(e.target.value)})} type="number" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Phase</label>
                    <select value={editCard.phase ?? ''} onChange={(e) => seteditCard({...editCard, phase: e.target.value})} className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white">
                        <option value="0">New</option>
                        <option value="1">Sent to Hotels</option>
                        <option value="2">Offers Received</option>
                        <option value="3">Completed</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[#5D7285] font-light">Notes</label>
                    <textarea name="notes" id="notes" value={editCard.notes ?? ''} onChange={(e) => seteditCard({...editCard, notes: e.target.value})} className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white"></textarea>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[#5D7285] font-light">Hotels</label>
                <div className="flex flex-col max-h-48 overflow-y-auto gap-1 py-1">
                    {editCard.hotels?.map((hotel, index) => (
                        <div key={index} className="flex gap-1 items-center">
                            <input value={hotel ?? ''} onChange={(e) => seteditCard({...editCard, hotels: editCard.hotels?.map((h, i) => i === index ? e.target.value : h)})} type="text" className="px-3 py-1 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                            <button onClick={() => seteditCard({...editCard, hotels: editCard.hotels?.filter((_, i) => i !== index)})} className="text-xs text-[#617589] flex items-center justify-center hover:text-[#ca1313] cursor-pointer"><span className="material-symbols-outlined">Delete</span></button>
                        </div>
                    ))}
                    <div className="flex flex-col gap-2">
                        <div onClick={() => seteditCard({...editCard, hotels: [...(editCard.hotels || []), '']})} className="flex items-center gap-2 hover:text-[#137DE8] cursor-pointer select-none">
                            <span className="material-symbols-outlined text-xs text-[#137DE8]">Add</span>
                            <span className="underline text-[#137DE8]">Add Hotel</span>
                        </div>
                    </div>
                </div>
            </div>
            {!selectedColumn && (
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#617589]">Created At: <span className="text-white">{formatDateShort(editCard.createdAt)}</span></span>
                    <span className="text-xs text-[#617589]">Modified At: <span className="text-white">{formatDateShort(editCard.updatedAt)}</span></span>
                </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => onClose()} className="px-3 py-1 bg-[#2D3A4A] rounded-xl border border-[#193653] text-white font-light cursor-pointer hover:bg-[#3A4A5C]">Cancel</button>
                <button onClick={() => onAction(editCard)} className="px-3 py-1 bg-[#137FEC] rounded-xl border border-[#137FEC] text-white font-light cursor-pointer hover:bg-[#137FEC]">Apply</button>
            </div>
        </div>
    )
}