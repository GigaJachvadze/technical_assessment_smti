import { Low } from "lowdb";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { KanbanDB } from "./model";
import { JSONFile } from "lowdb/node";

const file = path.join(process.cwd(), 'src', 'db', 'db.json');
const db = new Low<KanbanDB>(new JSONFile<KanbanDB>(file), {columns: [], cards: []});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    await delay(500);
    await db.read()

    const { id } = req.query;

    // Handle PATCH request to update kanban card
    if (req.method === "PATCH") {
        const { phase } = req.body;

        if (!id || !phase) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        // to simulate error
        if (id === "ERROR") {
            return res.status(400).json({ error: "This is an error message" });
        }

        const card = db.data.cards.find(c => c.id === id);

        if (card) {
            card.phase = phase;
        } else {
            return res.status(404).json({ message: "Card not found", error: true });
        }

        await db.write();

        return res.status(200).json({
            message: "Inquiry updated",
            id,
            phase,
        });
    }

  res.setHeader("Allow", ["PATCH"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));