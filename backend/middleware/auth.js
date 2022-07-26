// importer json web token
const jwt = require('jsonwebtoken');


// exporter la fonction qui sera notre middleware
module.exports = (req, res, next) => {
// recuperer le token
try{
    // recuperer le header et splitter pour diviser le chain de caracter en un tableau
    const token = req.headers.authorization.split('')[1];
    // appeller la method verfy de json web token, on passe le token qui mous avons recupere et la clé secret
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = {
        userId: userId
    };
}
catch(error){
    res.status(401).json({error});
}

};

// importer ce middleware dans le router