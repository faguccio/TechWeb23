## Paginazione:

- Quando faccio richieste di aggiunta per paginazione, se del contenuto e stato generato nel frattempo creo dei doppioni (per come e' strutturata la paginazione)

  - soluzione laboriosa: aggiungo time stamp e faccio paginazione da dopo quel timestamp
  - soluzione merdosa: elimino duplicati e faccio pagine abbastanza lunghe che non si nota se ne mancano alcuni (non vengono postati piu' post di quanti ne contiene una pagina nel frattempo)

## Altri bug

- deleted user: quando faccio la fetch di un utente per un post e lui e' eliminato metto come utente deleted user

## TODO

### Squealer app

- iscriversi (e togliersi) ai canali
  - Quando premi unsubscribe e subscribe non fa la richiesta PATCH, potremmo lasciarlo cosi' all'esame lo sgama e lo correggiamo davanti a lui
- nel corpo del messaggio vanno creati gli hashtag come canali se menzionati
- during channel creation, validation of user names and channel name availability
  - showing error
- visualizzare DM
- controllare diritto di post in un canale
- credo che il local storage sia condiviso fra le tre app (e del browser) per cui sarebbe meglio avere un prefisso (tokenApp o tokenMan)
