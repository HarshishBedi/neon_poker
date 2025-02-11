# public/script.py
import random

suits = ["♠", "♣", "♦", "♥"]
values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

def create_deck():
    deck = [f"{value}{suit}" for suit in suits for value in values]
    random.shuffle(deck)
    return deck

def deal_cards(deck):
    return [deck.pop(), deck.pop()], [deck.pop(), deck.pop()], [deck.pop(), deck.pop(), deck.pop()]

def place_bet(current_player, bet_amount, player1_chips, player2_chips, pot):
    if current_player == 1 and bet_amount <= player1_chips:
        player1_chips -= bet_amount
        pot += bet_amount
        current_player = 2
    elif current_player == 2 and bet_amount <= player2_chips:
        player2_chips -= bet_amount
        pot += bet_amount
        current_player = 1
    return player1_chips, player2_chips, pot, current_player

def evaluate_winner(player1_cards, player2_cards, community_cards):
    return f"Winner: {random.choice(['Player 1', 'Player 2', 'Tie'])}"

# Initialize game
deck = create_deck()
player1, player2, community = deal_cards(deck)

