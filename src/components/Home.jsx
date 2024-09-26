import { useState, useEffect } from 'react';
import NavBar from './Navbar';
import SwitchNavBar from './SwitchNavBar'; // Assurez-vous que ce composant est importé
import { useChatContext } from '../ChatContext';

export default function Home() {
  const { actualPage } = useChatContext();

  // State pour la largeur de l'écran
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // useEffect pour détecter la taille de l'écran
  useEffect(() => {
    // Fonction qui met à jour la largeur de l'écran
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Ajouter l'écouteur d'événement resize
    window.addEventListener('resize', handleResize);

    // Nettoyage de l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex-1 relative w-full overflow-y-auto flex justify-center">
        {screenWidth < 768 && <SwitchNavBar />}{' '}
        {/* Affiche SwitchNavBar si la largeur est inférieure à 768px */}
        {actualPage}
      </div>
    </>
  );
}
