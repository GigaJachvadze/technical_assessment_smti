export interface kanbanCard {
    id: string;
    potentialValue: number;
    clientName: string;
    contactPerson: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    phase: string;
    hotels: string[];
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface kanbanColumn {
    id: string;
    name: string;
    cards: kanbanCard[];
}

export interface kanban {
    id: string;
    columns: kanbanColumn[];
}
