const { useState, useEffect, useRef } = React;
const { createRoot, createPortal } = ReactDOM;

// CONFIG
const BASE_URL = 'http://localhost:3333';
const RESOURCE = 'animals';
const URL = `${BASE_URL}/${RESOURCE}`;

// API
const fetchJson = async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const searchAnimal = async animalName => {
  const query = animalName.trim();
  if (!query) return null;

  const [animal] = await fetchJson(
    `${URL}?search=${encodeURIComponent(query)}`,
  );

  if (!animal) return null;

  return {
    name: animal.name,
    description: animal.description || 'Descrizione non disponibile',
    image: animal.image || 'https://picsum.photos/500/500',
  };
};

// COMPONENTS
const AnimalCard = ({ animal }) => (
  <article>
    <h2>{animal.name}</h2>
    <p>{animal.description}</p>
    <img src={animal.image} alt={animal.name} />
  </article>
);

const Modal = ({
  title,
  content,
  show = false,
  confirmDisabled = false,
  onClose = () => {},
  onConfirm = () => {},
}) =>
  show &&
  createPortal(
    <div className='modal-container'>
      <div className='modal'>
        <h2>{title}</h2>
        <div>{content}</div>
        <div>
          <button onClick={onClose}>Annulla</button>
          <button onClick={onConfirm} disabled={confirmDisabled}>
            Conferma
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');
  const [searchState, setSearchState] = useState({ step: 'idle' });
  const canConfirm = searchState.step === 'success' && searchState.data?.name;
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showModal || !input.trim()) {
      setSearchState({ step: 'idle' });
      return;
    }

    let ignore = false;

    const loadAnimal = async () => {
      setSearchState({ step: 'loading' });

      try {
        const animal = await searchAnimal(input);

        if (ignore) return;

        setSearchState({
          step: 'success',
          data: animal,
        });
      } catch (error) {
        if (ignore) return;
        console.error(error);

        setSearchState({
          step: 'error',
          error: "Errore durante la ricerca dell'animale",
        });
      }
    };

    loadAnimal();

    return () => {
      ignore = true;
    };
  }, [input, showModal]);

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const closeModal = () => {
    setShowModal(false);
    setInput('');
    setSearchState({ step: 'idle' });
  };

  const handleInputChange = e => {
    const value = e.target.value;

    setInput(value);
    setSearchState({
      step: value.trim() ? 'loading' : 'idle',
    });
  };

  const handleAddAnimal = () => {
    if (!canConfirm) return;

    const animal = {
      id: crypto.randomUUID(),
      ...searchState.data,
    };

    setAnimals([...animals, animal]);
    closeModal();
  };

  const getSearchContent = () => {
    switch (searchState.step) {
      case 'idle':
        return <p>Inserisci il nome di un animale</p>;
      case 'loading':
        return <p>Caricamento...</p>;
      case 'error':
        return <p>{searchState.error}</p>;

      case 'success':
        return (
          <p>
            {searchState.data?.name
              ? `Animale trovato: ${searchState.data.name}`
              : 'Animale non trovato'}
          </p>
        );

      default:
        return null;
    }
  };

  const modalContent = (
    <>
      <input
        type='text'
        name='animal'
        value={input}
        onChange={handleInputChange}
        placeholder='Zebra'
        ref={inputRef}
      />

      {getSearchContent()}
    </>
  );

  const getAnimalsList = () => {
    switch (animals.length) {
      case 0:
        return <p>Nessun animale aggiunto</p>;

      default:
        return (
          <ul>
            {animals.map(animal => (
              <li key={animal.id}>
                <AnimalCard animal={animal} />
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <>
      <button type='button' onClick={openModal}>
        Aggiungi Animale
      </button>

      <Modal
        title={'Aggiungi Animale'}
        content={modalContent}
        show={showModal}
        onClose={closeModal}
        onConfirm={handleAddAnimal}
        confirmDisabled={!canConfirm}
      />

      <details>
        <summary>Animali</summary>
        {getAnimalsList()}
      </details>
    </>
  );
};

createRoot(document.querySelector('.lista-animali')).render(<AnimalList />);
