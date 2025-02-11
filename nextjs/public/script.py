# public/script.py
import random

suits = ["♠", "♣", "♦", "♥"]
values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

def create_deck():
    deck = [f"{value}{suit}" for suit in suits for value in values]
    random.shuffle(deck)
    return deck

def deal_cards(deck):
    return [deck.pop(), deck.pop()], [deck.pop(), deck.pop()], [deck.pop()]

def get_hand_rank(cards):
    # Simplified rank calculation
    values = [card[:-1] for card in cards]
    unique_values = set(values)
    if len(unique_values) == 2:
        return "Full House"
    if len(unique_values) == 3:
        return "Three of a Kind"
    return "High Card"

def evaluate_winner(player1_cards, player2_cards, community_cards):
    player1_hand = player1_cards + community_cards
    player2_hand = player2_cards + community_cards

    player1_rank = get_hand_rank(player1_hand)
    player2_rank = get_hand_rank(player2_hand)

    if player1_rank > player2_rank:
        return "Player 1 Wins!"
    elif player2_rank > player1_rank:
        return "Player 2 Wins!"
    else:
        return "It's a Tie!"

# Game setup
deck = create_deck()
player1, player2, community = deal_cards(deck)

result = evaluate_winner(player1, player2, community)
print(result)
