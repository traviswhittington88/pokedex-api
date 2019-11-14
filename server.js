require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const POKEDEX = require('./pokedex.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next){
  //  const bearerToken = req.get('Authorization').split(' ')[1];
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
   /* if(bearerToken !== apiToken) {
        res.status(401).json({ error: 'Unauthorized request' });
    }*/
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        res.status(401).json({ error: 'Unauthorized request' });
    }
    
    //move to the next middleware
    next()
})

/*app.use((req, res) => { 
    res.send('Hello, world!');
});*/

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`,`Fairy`, `Fighting`, `Fire`, 
                    `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, 
                    `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {    
    res.json(validTypes);
}

function handleGetPokemon(req, res) {
  const { name, type } = req.query;
  if(name) {
    let pokemon = POKEDEX.pokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    )
    if(pokemon.length > 0) {
    res.status(200).json(pokemon);
    } else {
      res.status(400).send('that pokemon name does not exist');
    }
  
  if(type) {
    let pokemon = POKEDEX.pokemon.filter(pokemon => 
      pokemon.type.filter(type => type.indludes(type))  
    )

  res.status(200).json(POKEDEX.pokemon);
  }
  
}

res.send(200).json(POKEDEX.pokemon);
}

app.get('/pokemon', handleGetPokemon);
app.get('/types', handleGetTypes);



app.use((error, req, res, next => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response);
}))

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    `Server listening at http://localhost:${PORT}`
});

