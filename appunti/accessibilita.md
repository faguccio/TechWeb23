## Appunti su accessibilita'

Bisogna un po' vedere come react e le altre tecnologie implementano ste robe, perche' e probabile ad esempio che il componente navbar di daisyui sia gia accessibile.

- specificare l'attributo lang ove necessario
  - gli screen reader leggeranno nella lingua specificata. Nel nostro caso possiamo lasciare un campo che dica la lingua usata nel post (secondario)
- specificare un testo alternativo alle immagini (alt)
  - quando uno fa un post, specificare un testo dell'immagine
  - immagini decorative richiedono la stringa vuota (cosi non danno fastidio)
- Usare le intestazioni (h1, h6)
  - farlo in modo corretto e gerarchico
  - Ogni pagina deve sempre contenere al massimo un livello di
    intestazione 1 (il titolo della pagina!).
- Form
  - bisogna associare le etichette ai campi, non basta che sia graficamente ovvio!
  - Ci sono piu modi
- tag semantici
  - come "section", "article", "nav"
  - hanno valore semantico, non grafico
