// app.js
// Runs a short demo of every storage operation.
// Once you have replaced the storage layer with SQLite,
// running this file should produce the same output as before.

import {
  getAllDecks,
  getDeckById,
  getAllCardsForDeck,
  addDeck,
  addCard,
  markCardLearned,
  deleteCard,
  deleteDeck,
} from './src/database.js';

console.log('=== Flashcard App ===\n');

// 1. List all decks
console.log('All decks:');
const decks = getAllDecks();
decks.forEach((deck) => {
  console.log(`  [${deck.id}] ${deck.name} — ${deck.description}`);
});

// 2. Get a single deck by id
console.log('\nLooking up deck 2:');
const deck2 = getDeckById(2);
console.log(`  Found: ${deck2.name}`);

// 3. Show all cards in deck 1
console.log('\nCards in "JavaScript Basics" (deck 1):');
const cards = getAllCardsForDeck(1);
cards.forEach((card) => {
  const status = card.learned ? '✓ learned' : '○ not yet';
  console.log(`  [${card.id}] ${status}  Q: ${card.question}`);
});

// 4. Add a new deck
console.log('\nAdding a new deck...');
const newDeck = addDeck('Git & GitHub', 'Version control basics');
console.log(`  Created: [${newDeck.id}] ${newDeck.name}`);

// 5. Add a card to the new deck
console.log('\nAdding a card to the new deck...');
const newCard = addCard(
  'What is a commit?',
  'A snapshot of your changes saved to the repository',
  newDeck.id
);
console.log(`  Created card [${newCard.id}]: "${newCard.question}"`);

// 6. Mark a card as learned
console.log('\nMarking card 1 as learned...');
const updated = markCardLearned(1);
console.log(`  Card 1 learned status is now: ${updated.learned}`);

// 7. Delete the card we just added (clean up)
console.log(`\nDeleting card ${newCard.id}...`);
const deleted = deleteCard(newCard.id);
console.log(`  Deleted: ${deleted}`);

// 8. Delete the deck we just added (clean up)
console.log(`\nDeleting deck ${newDeck.id}...`);
const deckDeleted = deleteDeck(newDeck.id);
console.log(`  Deleted: ${deckDeleted}`);

console.log('\n=== Done ===');
