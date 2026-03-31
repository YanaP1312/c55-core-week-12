// database.js
// Your task: implement each function below using better-sqlite3.
// The function signatures are identical to storage.js so you can
// compare the two files side by side.
//
// When every function works correctly, `node app.js` should
// print exactly the same output as it did with storage.js.

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, '../data/flashcards.db');

const db = new Database(DB_FILE);

// ----------------------------------------------------------------
// Decks
// ----------------------------------------------------------------

export function getAllDecks() {
  return db.prepare(`SELECT * FROM decks`).all();
}

export function getDeckById(id) {
  const getById = db
    .prepare(`SELECT name, description FROM decks WHERE id = ? `)
    .get(id);

  if (!getById) {
    return { name: null, description: null };
  }

  return getById;
}

export function addDeck(name, description) {
  const existedDecksInfo = getAllDecks();

  const existing = existedDecksInfo.find(
    (deck) => deck.name === name && deck.description === description
  );

  if (existing) {
    return existing;
  }

  const result = db
    .prepare(
      `INSERT INTO decks (name, description) VALUES (@name, @description)`
    )
    .run({ name, description });

  return db
    .prepare(`SELECT id, name, description FROM decks  WHERE id = ?`)
    .get(result.lastInsertRowid);
}

export function deleteDeck(deckId) {
  const deck = db.prepare(`DELETE FROM decks WHERE id = ?`).run(deckId);

  return deck.changes > 0 ? 'true' : 'false';
}

// ----------------------------------------------------------------
// Cards
// ----------------------------------------------------------------

export function getAllCardsForDeck(deckId) {
  return db
    .prepare(`SELECT id, answer, question, learned FROM cards WHERE deck_id=?`)
    .all(deckId);
}

export function addCard(question, answer, deckId) {
  const existedCardsInfoForDeck = getAllCardsForDeck(deckId);

  const existing = existedCardsInfoForDeck.find(
    (card) => card.question === question && card.answer === answer
  );

  if (existing) {
    return existing;
  }

  const result = db
    .prepare(
      `INSERT INTO cards (question, answer, deck_id) VALUES (@question, @answer, @deck_id)`
    )
    .run({ question, answer, deck_id: deckId });

  return db
    .prepare(`SELECT id, question FROM cards WHERE id = ?`)
    .get(result.lastInsertRowid);
}

export function markCardLearned(cardId) {
  db.prepare(`UPDATE cards SET learned = 1 WHERE id=?`).run(cardId);

  const card = db
    .prepare(`SELECT id, learned FROM cards WHERE id = ?`)
    .get(cardId);

  return {
    id: card.id,
    learned: card.learned === 1 ? 'true' : 'false',
  };
}

export function deleteCard(cardId) {
  const card = db.prepare(`DELETE FROM cards WHERE id=?`).run(cardId);
  return card.changes > 0 ? 'true' : 'false';
}
