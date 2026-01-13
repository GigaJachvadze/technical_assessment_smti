import { formatNumber } from "@/helper/numberFormat";
import KanbanCard from "./kanban.card";
import { kanbanCard, kanbanColumn } from "./model";
import { useDroppable } from '@dnd-kit/core';
import { useModal } from "../modal/modal-context";
import KanbanEditCard from "./kanban.editCard";
import toast from "react-hot-toast";


type KanbanColumnProps = {
  column: kanbanColumn;
  handleUpdateInquiry: (updatedInquiry: kanbanCard, isNew?: boolean) => void;
};

export default function KanbanColumn({column, handleUpdateInquiry}: KanbanColumnProps) {
    const {openModal, closeModal} = useModal();

    const {setNodeRef} = useDroppable({
        id: column.id,
    });

    async function handleAddCard(card: kanbanCard) {
        const response = await fetch('/api/kanban/inquiries', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(card),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            toast.error(errorBody?.error || 'Failed to add card. Please try again.');
            return;
        }
        
        handleUpdateInquiry(await response.json(), true);
        closeModal();
    }
    
    function emptyColumn() {
        return (<div className="text-center text-gray-400 italic flex flex-col gap-4 w-full h-full justify-center items-center opacity-50">
            <span className="material-symbols-outlined text-6xl">dashboard_customize</span>
            <span>No Active Deals</span>
        </div>)
    }
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <div className="flex flex-col gap-2 justify-between">
                    <h1 className="text-[#617589]">{column.name} ({column.cards.length})</h1>
                    <span className="text-[#137FEC]">CHF {formatNumber(column.cards.reduce((sum, card) => sum + card.potentialValue, 0))}</span>
                </div>
                <div onClick={() => openModal({Component: KanbanEditCard, componentProps: {onAction: (card: kanbanCard) => {handleAddCard(card)}, onClose: () => closeModal(), selectedColumn: column.id}})} className="bg-[#102337] rounded-full cursor-pointer hover:bg-[#137FEC] grow-0 w-8 h-8 flex justify-center items-center select-none">
                    <span className="material-symbols-outlined text-6xl">Add</span>
                </div>
            </div>
            
            <div ref={setNodeRef} className={`flex flex-col gap-4 min-w-72 min-h-48 ${!column.cards.length ? 'border' : ''} border-dashed rounded-2xl border-[#2B3847]`}>
                {column.cards.length === 0 && emptyColumn()}
                {column.cards.map(card => (
                    <div key={card.id}>
                        <KanbanCard card={card} handleUpdateInquiry={handleUpdateInquiry}></KanbanCard>
                    </div>
                ))}
            </div>
        </div>
    )
}