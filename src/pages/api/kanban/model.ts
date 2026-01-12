import { kanbanColumn } from "@/ui/components/kanban/model";

export interface KanbanDB {
  columns: kanbanColumn[];
  cards: any[];
}