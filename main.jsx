const { useState, useEffect, useRef } = React;
const { createRoot, createPortal } = ReactDOM;

// CONFIG
const BASE_URL = 'http://localhost:3333';
const RESOURCE = 'animals';
const URL = `${BASE_URL}/${RESOURCE}`;
const DEFAULT_ANIMAL_IMAGE = './assets/img/animal-placeholder.svg';

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
    id: animal.id,
    name: animal.name,
    description: animal.description || 'Descrizione non disponibile',
    image: animal.image || DEFAULT_ANIMAL_IMAGE,
  };
};

// COMPONENTS
const AnimalCard = ({ animal }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const image = hasImageError ? DEFAULT_ANIMAL_IMAGE : animal.image;

  return (
    <article>
      <h2>{animal.name}</h2>
      <p>{animal.description}</p>
      <img
        src={image}
        alt={
          image === DEFAULT_ANIMAL_IMAGE
            ? `Immagine non disponibile per ${animal.name}`
            : animal.name
        }
        onError={() => setHasImageError(true)}
      />
    </article>
  );
};

const Modal = ({
  title,
  content,
  show = false,
  confirmDisabled = false,
  onClose = () => {},
  onConfirm = () => {},
}) => {
  useEffect(() => {
    if (!show) return;

    // Close modal on Esc key press
    const handleKeyDown = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  return (
    show &&
    createPortal(
      <div
        className='modal-container'
        // Close modal when clicking outside of it
        onClick={e => e.target === e.currentTarget && onClose()}
      >
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
    )
  );
};

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');
  const [searchState, setSearchState] = useState({ step: 'idle' });
  const inputRef = useRef(null);

  // Check if the animal is already added to the list
  const isAlreadyAdded =
    searchState.step === 'success' &&
    animals.some(animal => animal.id === searchState.data?.id);

  // confirm button should be enabled only if the search was successful, the animal has a name, and it is not already added
  const canConfirm =
    searchState.step === 'success' &&
    Boolean(searchState.data?.name) &&
    !isAlreadyAdded;

  // Perform a search for the animal when the input changes and the modal is open
  useEffect(() => {
    if (!showModal || !input.trim()) {
      setSearchState({ step: 'idle' });
      return;
    }

    let ignore = false; // flag to ignore results if unmounts or input changes

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

    // Debounce search by 400ms
    const timeoutId = setTimeout(loadAnimal, 400);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
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

    setAnimals([...animals, searchState.data]);
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
        if (isAlreadyAdded) {
          return <p>Animale già aggiunto</p>;
        }

        const { data: animal } = searchState;

        return (
          <p>
            {animal?.name
              ? `Animale trovato: ${animal.name}`
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
        autoComplete='off'
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
