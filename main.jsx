const { useState } = React;
const { createRoot, createPortal } = ReactDOM;

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const Modal = ({
  title,
  content,
  show = false,
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
          <button onClick={onConfirm}>Conferma</button>
        </div>
      </div>
    </div>,
    document.body,
  );

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');

  const toggleModal = () => setShowModal(!showModal);

  const handleAddAnimal = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    setAnimals([...animals, capitalize(trimmedInput)]);
    setInput('');
    setShowModal(false);
  };

  const inputElement = (
    <input
      type='text'
      name='animal'
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder='Cane'
    />
  );

  const getAnimalsList = () => {
    switch (animals.length) {
      case 0:
        return <p>Nessun animale aggiunto</p>;

      default:
        return (
          <ul>
            {animals.map(animal => (
              <li key={animal}>{animal}</li>
            ))}
          </ul>
        );
    }
  };

  return (
    <>
      <button type='button' onClick={toggleModal}>
        Aggiungi Animale
      </button>

      <Modal
        title={'Aggiungi Animale'}
        content={inputElement}
        show={showModal}
        onClose={toggleModal}
        onConfirm={handleAddAnimal}
      />

      <details>
        <summary>Animali</summary>
        {getAnimalsList()}
      </details>
    </>
  );
};

createRoot(document.querySelector('.lista-animali')).render(<AnimalList />);
