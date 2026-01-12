// pages/api/kanban.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { KanbanDB } from './model'
import path from 'path';

const file = path.join(process.cwd(), 'src', 'db', 'db.json');
const db = new Low<KanbanDB>(new JSONFile<KanbanDB>(file), {columns: [], cards: []});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const { minimumValue, dateRange, clientName } = req.query;
  
  const minimumValueFilter = getQueryParam(minimumValue);
  const dateRangeFilter = getQueryParam(dateRange);
  const clientFilter = getQueryParam(clientName);

  await db.read()

  db.data ||= { columns: [], cards: [] };

  //join cards to columns
  const columns = db.data.columns;
  const cards = db.data.cards;
  
  const columnsWithCards = columns.map(column => ({
    ...column,
    cards: cards.filter(card => card.assignedColumn === column.id),
  }));

  return res.status(200).json(columnsWithCards)
}

const getQueryParam = (param?: string | string[]) =>
  Array.isArray(param) ? param[0] : param;
