// import Clarifai from 'clarifai';  // how it was fetched in front end
const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '62d30789d6eb4720a8865402286c9a83'  // this is public in network console! so move to backend!
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db) => {   // to update entries of a user (& increases  count)
  const { id } = req.body;
  db('users').where('id', '=', id)  // need to point to the 'users' db!
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}
