import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '/data/data.json');

function readData() {
  const raw = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function insertDecks(data, db) {
  const insertDecks = db.prepare(
    `INSERT INTO decks(name, description) VALUES (@name, @description)`
  );

  data.decks.forEach((deck) => {
    const { name, description } = deck;
    insertDecks.run({ name, description });
  });

  return;
}

function insertCards(data, db) {
  const insertCards = db.prepare(
    `INSERT INTO cards(question, answer, learned, deck_id) VALUES (@question, @answer, @learned, @deck_id)`
  );

  data.cards.forEach((card) => {
    const { question, answer, learned, deckId } = card;
    const fixLearned = learned === true ? 1 : 0;
    insertCards.run({ question, answer, learned: fixLearned, deck_id: deckId });
  });
  return;
}

function migrateExistingData() {
  const data = readData();
  const DB_FILE = join(__dirname, '../data/flashcards.db');
  const db = new Database(DB_FILE);

  insertDecks(data, db);
  insertCards(data, db);

  console.log('Connected to the database.', db);
  db.close();
}

migrateExistingData();
