import { DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useDndContext, useSensor, useSensors } from "@dnd-kit/core";
import KanbanColumn from "./kanban.column";
import { kanbanCard, kanbanColumn } from "./model"
import { useEffect, useState } from "react";
import KanbanFilter from "./kanban.filter";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useLoader } from "../loading/loading-context";

export default function KanbanBoard() {
  const [isMounted, setIsMounted] = useState(false);

  const [columns, setColumns] = useState<kanbanColumn[]>([] as kanbanColumn[]);

  const { start: startLoading, stop: stopLoading } = useLoader();

  const router = useRouter()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (!router.isReady) return;
    setIsMounted(true);

    const query = router.query ? `?${new URLSearchParams(router.query as Record<string, string>).toString()}` : '';

    startLoading();

    fetch(`api/kanban/inquiries/${query}`, {method: 'GET'}).then(res => res.json()).then(data => {
      setColumns(data);
      stopLoading();
    }).catch(() => {});

  }, [router.query, router.isReady]);

  async function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (!over) return;

    const activeId = String(active?.id || '');
    const overId = String(over?.id || '');

    if (!activeId || !overId) return;

    const sourceIndex = columns.findIndex(col => col.cards.some(c => c.id === activeId));
    if (sourceIndex === -1) return; // card not found

    const sourceCol = columns[sourceIndex];

    if (sourceCol.id === overId) return; //dropped into same column, do nothing

    const card = sourceCol.cards.find(c => c.id === activeId);
    if (!card) return;

    const oldColumns = [...columns];

    //Update UI optimistically
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

    fetch(`/api/kanban/${activeId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({phase: overId})
    }).then(async res => {
      if (!res.ok) {
        const errorBody = await res.json();
        toast.error(errorBody?.error || 'Failed to update inquiry');
        setColumns(oldColumns);
      }
    });
  }

  function handleUpdateInquiry(updatedInquiry: kanbanCard, isNew?: boolean): void {
    if (isNew) {
      setColumns(columns.map(col => {
        if (col.id === updatedInquiry.phase) {
          return {...col, cards: [...col.cards, updatedInquiry]};
        }
        return col;
      }));
      toast.success('Inquiry added successfully');
      return;
    } 

    //delete old card from column if column changed and add updated card to new column
    const changedColumn = columns.find(col => col.cards.some(c => c.id === updatedInquiry.id));

    if (changedColumn) {
      changedColumn.cards = changedColumn.cards.filter(c => c.id !== updatedInquiry.id);
      setColumns(columns.map(col => {
        if (col.id === updatedInquiry.phase) {
          return {...col, cards: [...col.cards, updatedInquiry]};
        }
        return col;
      }));
      return;
    }
  
    setColumns(columns.map(col => {
      if (col.id === updatedInquiry.phase) {
        console.log('updating column', col.id);
        return {...col, cards: col.cards.map(c => c.id === updatedInquiry.id ? updatedInquiry : c)};
      }
      return col;
    }));
    
    toast.success('Inquiry updated successfully');
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <KanbanFilter/>
      <div className="flex gap-6 p-4 w-max">
        {columns.map(column => (
          <KanbanColumn key={column.id} column={column} handleUpdateInquiry={handleUpdateInquiry}></KanbanColumn>
        ))}
      </div>
    </DndContext>
  )
}
