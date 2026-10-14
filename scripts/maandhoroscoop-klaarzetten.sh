#!/usr/bin/env bash
# Zet de maandhoroscoop van alle 12 sterrenbeelden klaar (AstroAPI + makkelijke taal), één voor één.
# Kosten: per teken dat nog niet is opgehaald 1 AstroAPI-call, en per teken zonder makkelijke versie 1 AI-call.
# Bedoeld voor het begin van elke maand (bijv. via cron op de 1e om 05:00).
for t in aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 300 "http://127.0.0.1:4210/api/publiek/maandhoroscoop/$t")
  echo "$(date '+%F %T') $t $code"
done
