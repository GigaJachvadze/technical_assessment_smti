import { formatNumber } from "@/helper/numberFormat";
import KanbanCard from "./kanban.card";
import { kanbanColumn } from "./model";

import { useDroppable } from '@dnd-kit/core';


type KanbanColumnProps = {
  column: kanbanColumn;
};

export default function KanbanColumn({column}: KanbanColumnProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: column.id,
    });
    
    function emptyColumn() {
        return (<div className="text-center text-gray-400 italic flex flex-col gap-4 w-full h-full justify-center items-center opacity-50">
            <span className="material-symbols-outlined text-6xl">dashboard_customize</span>
            <span>No Active Deals</span>
        </div>)
    }
    
    return (
        <div className={"flex flex-col gap-2 "}>
            <h1 className="text-[#617589]">{column.name} ({column.cards.length})</h1>
            <span className="text-[#137FEC]">CHF {formatNumber(column.cards.reduce((sum, card) => sum + card.potentialValue, 0))}</span>
            <div ref={setNodeRef} className={`flex flex-col gap-4 min-w-72 min-h-48 ${!column.cards.length ? 'border' : ''} border-dashed rounded-2xl border-[#2B3847]`}>
                {column.cards.length === 0 && emptyColumn()}
                {column.cards.map(card => (
                    <div key={card.id}>
                        <KanbanCard card={card}></KanbanCard>
                    </div>
                ))}
            </div>
        </div>
    )
}