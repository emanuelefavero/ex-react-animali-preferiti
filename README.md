# EX - I miei animali preferiti

Esercizio di React su Modals, Portals, details, dal mio corso web dev (specializzazione Frontend).

## Avvio

Apri `index.html` con un server locale, ad esempio Live Server. Il codice React si trova in [main.jsx](main.jsx).

Per il bonus, clona e avvia anche l'[API locale](https://github.com/boolean-it/resources) sulla porta `3333`.

## Consegna

Rendi interattiva la pagina HTML fornita integrando React direttamente nel documento, senza ricreare la pagina da zero.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>I miei animali Preferiti</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>
      <h1>I miei animali Preferiti</h1>
    </header>
    <main>
      <figure>
        <img src="https://picsum.photos/400/300" alt="Immagine Casuale" />
      </figure>
      <div class="lista-animali"></div>
    </main>
    <footer>
      <p>Creato con amore da... un collega sbadato! 🐾</p>
    </footer>
  </body>
</html>
```

```css
/* style.css */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
header {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
main {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
img {
  max-width: 100%;
}
.lista-animali {
  width: 100%;
}
```

### Milestone 1 - Lista di animali

Monta un componente React dentro `.lista-animali`. Deve contenere un `<details>` con titolo "Animali" e una lista `<ul>`, generata da un array di stringhe `animals`, con un `<li>` per ogni animale.

### Milestone 2 - Aggiunta casuale

Gestisci `animals` con `useState`, partendo da un array vuoto. Sopra il `<details>`, aggiungi il bottone "Aggiungi Animale": a ogni click inserisce nella lista un animale casuale scelto da questo array:

```javascript
const animalsChoices = ['Cane', 'Gatto', 'Pappagallo', 'Cavallo', 'Panda'];
```

### Milestone 3 - Aggiunta tramite modale

Aggiungi e estendi il componente `Modal`:

```javascript
const Modal = ({ title, content, show = false, onClose = () => {} }) => {
  return (
    show &&
    ReactDOM.createPortal(
      <div className='modal-container'>
        <div className='modal'>
          <h2>{title}</h2>
          <p>{content}</p>
          <button onClick={onClose}>Annulla</button>
        </div>
      </div>,
      document.body,
    )
  );
};
```

```css
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
```

- Mantieni le prop `title`, `show` e `onClose` e permetti a `content` di ricevere un componente qualsiasi.
- Riunisci i bottoni "Annulla" e "Conferma" in un nuovo `<div>` in fondo alla modale.
- Aggiungi la prop `onConfirm` per gestire la conferma.

Sostituisci l'aggiunta casuale: "Aggiungi Animale" apre la modale con un input di testo passato tramite `content`. "Conferma" aggiunge il nome inserito alla lista e chiude la modale; "Annulla" la chiude senza modificare la lista.

### Bonus - Ricerca API e card

> Nota; Qui dobbiamo usare l'API locale per cercare gli animali in base al nome inserito nell'input.

Cerca l'animale usando il valore dell'input:

```text
http://localhost:3333/animals?search=[animalName]
```

- Mostra "Caricamento..." durante la richiesta.
- Usa il primo risultato dell'array per creare un oggetto con `name`, `description` e `image`. Se mancano descrizione o immagine, usa rispettivamente un testo come "Descrizione non disponibile" e un'immagine predefinita.
- Aggiungi l'oggetto alla lista e visualizzalo come card con nome, immagine e descrizione.
- Se non ci sono risultati, mostra "Nessun animale trovato". In caso di problemi di rete o altri errori, mostra "Errore durante la ricerca dell'animale".
