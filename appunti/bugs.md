## Paginazione:

- Quando faccio richieste di aggiunta per paginazione, se del contenuto e stato generato nel frattempo creo dei doppioni (per come e' strutturata la paginazione)
  - soluzione laboriosa: aggiungo time stamp e faccio paginazione da dopo quel timestamp
  - soluzione merdosa: elimino duplicati e faccio pagine abbastanza lunghe che non si nota se ne mancano alcuni (non vengono postati piu' post di quanti ne contiene una pagina nel frattempo)
