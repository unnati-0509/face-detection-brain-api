
///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

import { response } from "express";

const returnClarifaiRequestOptions = (imageURL) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = process.env.CLARIFAI_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.CLARIFAI_USER_ID;       
    const APP_ID = process.env.CLARIFAI_APP_ID;
    // Change these to whatever model and image URL you want to use
    //const MODEL_ID = 'face-detection';  
    const IMAGE_URL = imageURL;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
  
    return requestOptions;
}
  
const MODEL_ID = 'face-detection';

const handleAPICall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(req.body.input))
        .then(response => response.text())    
        .then(result => {res.json(result)})
        .catch(error => {console.log('error', error)});
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

export default { handleImage, handleAPICall};