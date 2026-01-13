import { useDndContext, useDraggable } from "@dnd-kit/core";
import { kanbanCard } from "./model";
import { formatRelativeDate } from "@/helper/dateFormat";
import { formatNumber } from "@/helper/numberFormat";
import { useModal } from "../modal/modal-context";
import KanbanEditCard from "./kanban.editCard";
import toast from "react-hot-toast";

type KanbanCardProps = {
  card: kanbanCard;
  handleUpdateInquiry: (updatedInquiry: kanbanCard, isNew?: boolean) => void;
};

export default function KanbanCard({card, handleUpdateInquiry}: KanbanCardProps) {
    const { active } = useDndContext();

    const {openModal, closeModal} = useModal();

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: card.id,
    });
    
    const style = transform ? {transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,} : undefined;

    async function handleEditAction(editedCard: kanbanCard) {
        const response = await fetch('/api/kanban/inquiries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedCard),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            toast.error(errorBody?.error || 'Failed to update card. Please try again.');
        }

        handleUpdateInquiry(await response.json(), false);
        closeModal();
    }

    return (
        <div onClick={() => openModal({Component: KanbanEditCard, componentProps: { card: card, isNew: false, onAction: handleEditAction, onClose: closeModal }})} ref={setNodeRef} style={style} {...listeners} {...attributes} className={`flex flex-col gap-2 border-2 p-4 rounded-2xl ${card.potentialValue > 50000 ? 'border-[#776A33]' : 'border-[#2D3A4A]'} bg-[#1A242E] active:scale-[1.05] transition-[scale] select-none cursor-pointer relative ${active?.id === card.id ? 'z-50' : 'z-0'}`}>
            <span className="text-xs text-[#617589]">CLIENT</span>
            <span>{card.clientName}</span>
            <div className="flex gap-2 items-center">
                <span className="material-symbols-outlined text-sm! text-[#617589]">Calendar_Today</span>
                <span className="text-sm font-light">{formatRelativeDate(card.eventDate)}</span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="material-symbols-outlined text-sm! text-[#617589]">Diversity_3</span>
                <span className="text-sm font-light">{card.guestCount} Guests</span>
            </div>
            <div className={`flex gap-2 items-center ${card.potentialValue > 50000 ? 'bg-[#23252B] border-[#312825]' : 'bg-[#192D41] border-[#193653]'} px-2 py-1 rounded-lg w-full text-white border `}>
                <span className={`material-symbols-outlined text-lg! ${card.potentialValue > 50000 ? 'text-[#FBBF24]' : 'text-[#137FEC]'}`}>Payments</span>
                <span  className={`text-sm font-light ${card.potentialValue > 50000 ? 'text-[#FDE68A]' : ''}`}>CHF {formatNumber(card.potentialValue)}</span>
            </div>
        </div>
    )
}