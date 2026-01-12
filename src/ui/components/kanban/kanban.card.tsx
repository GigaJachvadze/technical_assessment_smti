import { useDraggable } from "@dnd-kit/core";
import { kanbanCard } from "./model";
import { formatDateShort, formatRelativeDate } from "@/helper/dateFormat";
import { formatNumber } from "@/helper/numberFormat";

type KanbanCardProps = {
  card: kanbanCard;
};

export default function KanbanCard({card}: KanbanCardProps) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: card.id,
    });
    
    const style = transform ? {transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,} : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="flex flex-col gap-2 border-2 p-4 rounded-2xl border-[#2D3A4A] bg-[#1A242E]">
            <span className="text-xs">CLIENT</span>
            <span>{card.clientName}</span>
            <div className="flex gap-2 items-center">
                <span className="material-symbols-outlined text-sm! text-[#617589]">Calendar_Today</span>
                <span className="text-sm font-light">{formatRelativeDate(card.eventDate)}</span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="material-symbols-outlined text-sm! text-[#617589]">Diversity_3</span>
                <span className="text-sm font-light">{card.guestCount} Guests</span>
            </div>
            
            <div className="flex gap-2 items-center bg-[#192D41] px-2 py-1 rounded-lg w-full text-white border border-[#193653]">
                <span className="material-symbols-outlined text-lg! text-[#137FEC]">Payments</span>
                <span className="text-sm font-light">CHF {formatNumber(card.potentialValue)}</span>
            </div>
        </div>
    )
}