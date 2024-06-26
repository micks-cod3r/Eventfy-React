const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gabola01',
    database: 'eventify'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.post('/cadastro', (req, res) => {
    const { username, telefone, usercpf, usercep, estado, cidade, userrua, numero, useremail, password } = req.body;

    if (!username || !telefone || !usercpf || !usercep || !estado || !cidade || !userrua || !numero || !useremail || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const checkQuery = 'SELECT cpf FROM usuarios WHERE cpf = ?';
    db.query(checkQuery, [usercpf], (checkErr, checkResults) => {
        if (checkErr) {
            return res.status(500).json({ error: `Error checking CPF: ${checkErr.sqlMessage}` });
        }

        if (checkResults.length > 0) {
            return res.status(400).json({ error: 'CPF already exists' });
        }

        const insertQuery = 'INSERT INTO usuarios (nome, email, senha, telefone, cpf, cep, estado, cidade, rua, number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [username, useremail, password, telefone, usercpf, usercep, estado, cidade, userrua, numero];

        db.query(insertQuery, values, (insertErr, insertResults) => {
            if (insertErr) {
                return res.status(500).json({ error: `Error inserting data: ${insertErr.sqlMessage}` });
            }
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { useremail, password } = req.body;

    if (!useremail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.query(query, [useremail, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking user credentials' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});


app.post('/criar', (req, res) => {
    const { nome_evento, descricao, localizacao, data, horario, ingressos_disponiveis, categoria, imagem_url } = req.body;

    if (!nome_evento || !descricao || !localizacao || !data || !horario || !ingressos_disponiveis || !categoria) {
        return res.status(400).json({ error: 'All fields except image are required' });
    }

    const checkQuery = 'SELECT * FROM eventos WHERE nome_evento = ?';
    db.query(checkQuery, [nome_evento], (checkErr, checkResults) => {
        if (checkErr) {
            return res.status(500).json({ error: 'Error checking event name: ' + checkErr.sqlMessage });
        }

        if (checkResults.length > 0) {
            return res.status(400).json({ error: 'Event name already exists' });
        }

        const insertQuery = 'INSERT INTO eventos (nome_evento, descricao, localizacao, data, horario, ingressos_disponiveis, ingressos_vendidos, categoria, imagem_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nome_evento, descricao, localizacao, data, horario, ingressos_disponiveis, 0, categoria, imagem_url];

        db.query(insertQuery, values, (insertErr, insertResults) => {
            if (insertErr) {
                return res.status(500).json({ error: 'Error inserting data: ' + insertErr.sqlMessage });
            }

            let categoryFolder;
            switch (categoria) {
                case 'Desenvolvimento Pessoal e Carreira':
                    categoryFolder = path.join(__dirname, '../src/components/eventos/Des');
                    break;
                case 'Tecnologia e Inovação':
                    categoryFolder = path.join(__dirname, '../src/components/eventos/tecno');
                    break;
                case 'Sustentabilidade e Responsabilidade Social':
                    categoryFolder = path.join(__dirname, '../src/components/eventos/Sust');
                    break;
                case 'Cultura e Expressão Artística':
                    categoryFolder = path.join(__dirname, '../src/components/eventos/Cult');
                    break;
                default:
                    categoryFolder = path.join(__dirname, '../src/components/eventos/Other');
            }

            const filePath = path.join(categoryFolder, `${nome_evento.replace(/\s+/g, '_')}.jsx`);

            const jsxTemplate = `
                import { useState } from 'react';
                import '../Evento.css';
                import Header from '../../Header';
                import { Link } from 'react-router-dom';

                const Evento = ({ nome_evento, data, localizacao, descricao, imagem_url, categoria, relatedEvents }) => {
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
                            <h2>{nome_evento}</h2>
                            <p><i className="far fa-calendar-alt"></i> {data}</p>
                            <p><i className="fas fa-map-marker-alt"></i> {localizacao}</p>
                            <button
                                className={\`buy-ticket \${isInscrito ? 'inscrito' : ''}\`}
                                onClick={handleInscricao}
                                disabled={isInscrito}
                            >
                                {isInscrito ? 'Inscrito' : 'INSCREVA-SE AQUI'}
                            </button>
                            {isInscrito && <p className="confirmation-message">Inscrição confirmada!</p>}
                            <button className="show-details" onClick={toggleDetails}>VER MAIS DETALHES</button>
                            <div id="event-details-more" className="event-details-more" style={{ display: showDetails ? 'block' : 'none' }}>
                                <p>{descricao}</p>
                            </div>
                            </div>
                            {imagem_url && (
                            <div className="event-image">
                                <img src={imagem_url} alt="Imagem do Evento" />
                            </div>
                            )}
                        </section>
                        <section className="related-events">
                            <h2>Eventos relacionados a {categoria}</h2>
                            <div className="related-events-container">
                            {relatedEvents.map(event => (
                                <div className="related-event" key={event.id}>
                                <Link to={event.link}>
                                    <img src={event.imageUrl} alt={event.name} />
                                    <p>{event.name}</p>
                                </Link>
                                </div>
                            ))}
                            </div>
                        </section>
                        </main>
                    </div>
                    </div>
                );
                };

export default Evento;
`;


            try {
                fs.writeFileSync(filePath, jsxTemplate);
                res.status(200).json({ message: 'Event registered and file created successfully' });
            } catch (err) {
                res.status(500).json({ error: 'Error creating file: ' + err.message });
            }
        });
    });
});

app.get('/eventos/:nome_evento', (req, res) => {
    const nomeEvento = req.params.nome_evento.replace(/_/g, ' '); // Substitui underscores por espaços
    console.log('Nome do evento recebido:', nomeEvento);
    
    const query = 'SELECT * FROM eventos WHERE nome_evento = ?';
    db.query(query, [nomeEvento], (err, results) => {
        if (err) {
            console.error('Error fetching event:', err);
            return res.status(500).json({ error: 'Error fetching event: ' + err.sqlMessage });
        }
        if (results.length === 0) {
            console.log('Evento não encontrado:', nomeEvento);
            return res.status(404).json({ error: 'Event not found' });
        }
        console.log('Evento encontrado:', results[0]);
        res.status(200).json(results[0]);
    });
});
app.get('/test', (req, res) => {
    const nomeEvento = req.query.nome_evento;
    console.log('Nome do evento recebido:', nomeEvento);
    res.status(200).json({ message: `Evento recebido: ${nomeEvento}` });
});




app.post('/OrgLogin', (req, res) => {
    const { useremail, password } = req.body;

    if (!useremail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM gerentes WHERE email = ? AND senha = ?';
    db.query(query, [useremail, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking organizer credentials' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});
app.get('/eventos', (req, res) => {
    const query = 'SELECT * FROM eventos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching events: ' + err.sqlMessage });
        }
        res.status(200).json(results);
    });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
