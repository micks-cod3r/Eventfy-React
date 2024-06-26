import { useState } from 'react';
import '../Evento.css';
import Header from '../../Header';
import { Link } from 'react-router-dom';
import Fest from '../../../assets/Fest.webp';
import Urban from '../../../assets/Urban.webp';
import Lite from '../../../assets/Lite.webp';

const Evento = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isInscrito, setIsInscrito] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleInscricao = () => {
    setIsInscrito(true);
    console.log('Inscrição confirmada');
  };

  return (
    <div>
      <Header />
      <div>
        <main>
          <div className="blur-background"></div>
          <section className="event-banner">
            <div className="event-details">
              <h2>Encontro de Literatura e Performance Poética</h2>
              <p><i className="far fa-calendar-alt"></i> 30 de junho de 2024</p>
              <p><i className="fas fa-map-marker-alt"></i> Teatro G3 Telecom - Teresina/PI</p>
              <button
                className={`buy-ticket ${isInscrito ? 'inscrito' : ''}`}
                onClick={handleInscricao}
                disabled={isInscrito}
              >
                {isInscrito ? 'Inscrito' : 'INSCREVA-SE AQUI'}
              </button>
              {isInscrito && <p className="confirmation-message">Inscrição confirmada!</p>}
              <button className="show-details" onClick={toggleDetails}>VER MAIS DETALHES</button>
              <div id="event-details-more" className="event-details-more" style={{ display: showDetails ? 'block' : 'none' }}>
                <p>O Encontro de Literatura e Performance Poética reúne escritores, poetas e performers para uma celebração da palavra escrita e falada. O evento inclui leituras de obras originais, sessões de autógrafos, mesas redondas sobre processos criativos e a importância da literatura na sociedade contemporânea. Haverá também performances poéticas ao vivo, onde os participantes podem se expressar e compartilhar suas poesias em um ambiente acolhedor e inspirador. Oficinas de escrita criativa serão oferecidas para ajudar os aspirantes a escritores a desenvolverem suas habilidades e encontrarem sua voz única.</p>
              </div>
            </div>
            <div className="event-image">
              <img src={Lite} alt="Imagem do Evento" />
            </div>
          </section>
          <section className="related-events">
            <h2>Eventos relacionados a Cultura e Expressão Artística</h2>
            <div className="related-events-container">
              <div className="related-event">
                <Link to='/Urban'>
                  <img src={Urban} alt="Workshop de Arte Urbana: Grafite e Street Art" />
                  <p>Workshop de Arte Urbana: Grafite e Street Art</p>
                </Link>
              </div>
              <div className="related-event">
                <Link to='/Fest'>
                  <img src={Fest} alt="Festival de Cinema Independente e Arte Experimental" />
                  <p>Festival de Cinema Independente e Arte Experimental</p>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Evento;
