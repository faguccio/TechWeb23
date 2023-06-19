## Paginazione:

- Quando faccio richieste di aggiunta per paginazione, se del contenuto e stato generato nel frattempo creo dei doppioni (per come e' strutturata la paginazione)

  - soluzione laboriosa: aggiungo time stamp e faccio paginazione da dopo quel timestamp
  - soluzione merdosa: elimino duplicati e faccio pagine abbastanza lunghe che non si nota se ne mancano alcuni (non vengono postati piu' post di quanti ne contiene una pagina nel frattempo)

## Altri bug

- deleted user: quando faccio la fetch di un utente per un post e lui e' eliminato metto come utente deleted user
- Postcard finche non carica l'utente bugga l'immagine
- utenti hanno la lista dei post a cui hanno messo like. Quando faccio richiesta di un utente potrebbe volerci molto a mandare questa lista, per cui dovrei eliminare il campo prima di inviare la risposta
- i likes non sono accessibili, per capire se ho messo like c'e' il background (considerare di usare delle checkbox)

## TODO

### Squealer app

- iscriversi (e togliersi) ai canali
  - Quando premi unsubscribe e subscribe non fa la richiesta PATCH, potremmo lasciarlo cosi' all'esame lo sgama e lo correggiamo davanti a lui
- nel corpo del messaggio vanno creati gli hashtag come canali se menzionati
- creazione di messaggi automatici aggiungere la posizione (abilitarla con await)
- while a timer is set for automatic sending, show some colored stuff to attest that
- during channel creation, validation of user names and channel name availability
  - showing error
- se l'utente non e' loggato ritornare solo canali squea
- visualizzare DM
