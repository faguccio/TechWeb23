## Paginazione:

- Quando faccio richieste di aggiunta per paginazione, se del contenuto e stato generato nel frattempo creo dei doppioni (per come e' strutturata la paginazione)

  - soluzione laboriosa: aggiungo time stamp e faccio paginazione da dopo quel timestamp
  - soluzione merdosa: elimino duplicati e faccio pagine abbastanza lunghe che non si nota se ne mancano alcuni (non vengono postati piu' post di quanti ne contiene una pagina nel frattempo)

- deleted user: quando faccio la fetch di un utente per un post e lui e' eliminato metto come utente deleted user
- Postcard finche non carica l'utente bugga l'immagine

## TODO

### Squealer app

- La home e la channel view vanno fuse. La channel bar e la search bar possono stare insieme, mentre la channel view e' solo una richiesta api diversa
- Manca la parte di generazione messaggi automatici da parte del client
- iscriversi (e togliersi) ai canali
- creare canali
- Postcard non mostra destinatari
- nel corpo del messaggio vanno creati gli hashtag come canali se menzionati
- creazione di messaggi automatici aggiungere la posizione (abilitarla con await)
- Quando premi unsubscribe e subscribe non fa la richiesta PATCH, potremmo lasciarlo cosi' all'esame lo sgama e lo correggiamo davanti a lui
