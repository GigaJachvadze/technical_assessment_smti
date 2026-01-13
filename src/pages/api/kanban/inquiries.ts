// pages/api/kanban.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { KanbanDB } from './model'
import path from 'path';
import { kanbanCard } from '@/ui/components/kanban/model';

const file = path.join(process.cwd(), 'src', 'db', 'db.json');
const db = new Low<KanbanDB>(new JSONFile<KanbanDB>(file), {columns: [], cards: []});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await delay(500);

  // Handle GET request to fetch kanban cards with optional filtering
  if (req.method === "GET") {
    const { startValue, endValue, startDate, endDate, name } = req.query;

    const matchesFilter = (card: kanbanCard) => {
      if (name && !card.clientName.toLowerCase().includes(name.toString().toLowerCase())) return false;

      if (startValue != undefined && card.potentialValue < parseInt(startValue.toString())) return false;
      if (endValue != undefined && card.potentialValue > parseInt(endValue.toString())) return false;

      if (startDate != undefined || endDate != undefined) {
        const eventDate = new Date(card.eventDate);
        if (startDate != undefined && eventDate < new Date(startDate.toString())) return false;
        if (endDate != undefined && eventDate > new Date(endDate.toString())) return false;
      }

      return true;
    };

    await db.read()

    db.data ||= { columns: [], cards: [] };

    const columns = db.data.columns;
    const cards = db.data.cards;

    const filteredCards: kanbanCard[] = cards.filter(matchesFilter);

    const columnsWithCards = columns.map(column => ({
      ...column,
      cards: filteredCards.filter(card => card.phase === column.id),
    }));

    return res.status(200).json(columnsWithCards)
  }

  // Handle PUT request to create a new kanban card
  if (req.method === "PUT") {
    const newCard: kanbanCard = req.body;
    console.log(newCard);
    if (!newCard.clientName || !newCard.eventDate || !newCard.potentialValue || !newCard.guestCount || !newCard.phase || !newCard.eventType || !newCard.contactPerson || !newCard.hotels || !newCard.hotels.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    newCard.id = `card-${Date.now()}`;
    newCard.createdAt = new Date().toISOString();
    newCard.updatedAt = newCard.createdAt;
    await db.read()

    db.data.cards.push(newCard);

    await db.write();
    return res.status(200).json(newCard);
  }

  // Handle POST request to update an existing kanban card
  if (req.method === "POST") {
    const updatedCard: kanbanCard = req.body;
    if (!updatedCard.clientName || !updatedCard.eventDate || !updatedCard.potentialValue || !updatedCard.guestCount || !updatedCard.phase || !updatedCard.eventType || !updatedCard.contactPerson || !updatedCard.hotels || !updatedCard.hotels.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await db.read()

    const index = db.data.cards.findIndex(c => c.id === updatedCard.id);

    if (index !== -1) {
      db.data.cards[index] = updatedCard;
      await db.write();
      return res.status(200).json(updatedCard);
    } else {
      return res.status(404).json({ error: "Card not found" });
    }
  }
}

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));