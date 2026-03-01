# Personal Hub Tracker

App mobile Angular: centro personale per **Attività fisica**, **To-Do** e **Diario**. Design ispirato a TripGlide (minimal, premium, responsive).

## Avvio

```bash
npm install
npm start
```

Apri [http://localhost:4200](http://localhost:4200). Per test su mobile usa la stessa rete e l’indirizzo IP della macchina.

## Funzionalità

- **Tracker Attività (Palestra)**: calendario mensile, giorni con allenamento evidenziati, contatore mensile che si aggiorna in tempo reale, note per giorno, modifica/cancellazione, conferma prima di eliminare.
- **To-Do**: crea/modifica/elimina, segna completato, ordinamento (non completate sopra), animazioni add/remove, conferma prima di eliminare.
- **Diario**: crea/modifica/elimina note, vista cronologica (più recenti prima), conferma prima di eliminare.

**Persistenza**: tutti i dati (allenamenti, to-do, note del diario) sono salvati in **localStorage**. Riaprendo l’app trovi tutto come l’hai lasciato.

## Tech

- Angular 19, standalone components, lazy routing
- CSS con variabili (palette, radius, ombre come da design)
- Servizi con `localStorage` per stato persistente
