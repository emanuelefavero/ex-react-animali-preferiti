const { useState } = React;
const { createRoot } = ReactDOM;

const animalsChoices = ['Cane', 'Gatto', 'Pappagallo', 'Cavallo', 'Panda'];

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);

  // Filter out animals that have already been added to the list
  const availableChoices = animalsChoices.filter(
    choice => !animals.includes(choice),
  );
  const allAnimalsAdded = availableChoices.length === 0;

  const addAnimal = () => {
    const randomIndex = Math.floor(Math.random() * availableChoices.length);
    const randomAnimal = availableChoices[randomIndex];

    return setAnimals(prev => [...prev, randomAnimal]);
  };

  return (
    <>
      <button type='button' onClick={addAnimal} disabled={allAnimalsAdded}>
        {allAnimalsAdded ? 'Animali Aggiunti' : 'Aggiungi Animale'}
      </button>

      <details>
        <summary>Animali</summary>
        {!animals.length && <p>Nessun animale aggiunto</p>}

        {animals && (
          <ul>
            {animals.map(animal => (
              <li key={animal}>{animal}</li>
            ))}
          </ul>
        )}
      </details>
    </>
  );
};

createRoot(document.querySelector('.lista-animali')).render(<AnimalList />);
