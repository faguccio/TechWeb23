# App tasklist

- leggere slide di accessibilita'
- leggere guida di react per non impazzire poi

## Features

- [ ] Navbar

  - [ ] immagine utente
    - Fa da tasto per aprire un menu da mobile, mentre da pc e gia' aperto.
    - Se non troppo difficile, menu che esce da sinistra (animazione ?)

### Componente messaggio

Per capire come implementare il componente, il primo passo e' fare un endpoint che ritorni tutti i dati di un messaggio/post. Dopodiche' posso implementare le funzioni fetch per ottenere tali dati e renderizzarli sul post

1. [x] endpoint nel backend

   - uso di swagger per ricordarsi come sono fatte le risorse
   - definizione di tutti i campi necessari ad un post

2. [x] fetch nel frontend

3. [x] prendere i dati e da li costruire il componente

   - [x] user
   - [x] destinatari
   - [x] corpo testuale
   - [x] immagine
   - [x] geolocalizzazione

4. [ ] reazioni
   - [x] aggiungere reazioni all componente
   - [ ] aggiungere al backend
   - [ ] aggiungere funzioni di aggiunta e tolta
