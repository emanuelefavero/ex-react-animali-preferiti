const { createRoot } = ReactDOM;

const animals = [
  'Lion',
  'Giraffe',
  'Elephant',
  'Zebra',
  'Cheetah',
  'Leopard',
  'Hyena',
  'Gazelle',
  'Flamingo',
].sort((a, b) => a.localeCompare(b));

const AnimalList = ({ animals }) =>
  animals.length > 0 && (
    <details>
      <summary>Animali</summary>
      <ul>
        {animals.map(animal => (
          <li key={animal}>{animal}</li>
        ))}
      </ul>
    </details>
  );

createRoot(document.querySelector('.lista-animali')).render(
  <AnimalList animals={animals} />,
);
