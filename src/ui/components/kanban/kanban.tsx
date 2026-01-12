import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import KanbanColumn from "./kanban.column";
import { kanbanColumn } from "./model"
import { useEffect, useState } from "react";



export default function KanbanBoard() {
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
  useSensor(MouseSensor),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  }));

  const [columns, setColumns] = useState<kanbanColumn[]>([] as kanbanColumn[]);

  useEffect(() => {
    setIsMounted(true);
    fetch('api/kanban/inquiries/').then(res => res.json()).then(data => {
      console.log(data);
      setColumns(data);
    }).catch(() => {});
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    // If dropped outside a column, do nothing
    if (!over) return;

    const activeId = String(active?.id || ''); // e.g. 'draggable-0'
    const overId = String(over?.id || ''); // e.g. 'unique-id-1'

    if (!activeId || !overId) return;

    // find source column index
    const sourceIndex = columns.findIndex(col => col.cards.some(c => c.id === activeId));
    if (sourceIndex === -1) return; // card not found

    const sourceCol = columns[sourceIndex];

    // if dropped into same column, do nothing
    if (sourceCol.id === overId) return;

    const card = sourceCol.cards.find(c => c.id === activeId);
    if (!card) return;

    const newColumns = columns.map(col => {
      if (col.id === sourceCol.id) {
        return {...col, cards: col.cards.filter(c => c.id !== activeId)};
      }
      if (col.id === overId) {
        return {...col, cards: [...col.cards, card]};
      }
      return col;
    });

    setColumns(newColumns);

    // Update backend
    fetch(`/api/kanban/${activeId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({assignedColumn: overId})
    }).catch(() => {
      setColumns(columns);
    });
  }

  console.log(columns);

  if (!isMounted) {
    return (<div>Loading...</div>);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 shrink-0 grow-0">
        {columns.map(column => (
          <KanbanColumn key={column.id} column={column}></KanbanColumn>
        ))}
      </div>
    </DndContext>
  )
}