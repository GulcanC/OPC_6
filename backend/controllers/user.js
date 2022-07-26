// installer et importer bcrypt, 
const bcrypt = require('bcrypt');
// On a besoin de model/user
const User = require('../models/user');

const jwt = require('jsonwebtoken');

// le controleur aura besoin de deux méthodes, de deux fonction, de deux middleware
// la focntion signup() pour l'enregistrement de nouveaux utilisateurs 
exports.signup = (req, res, next) => {
    let regExEmail = new RegExp(/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/);
    // It should be 4 characters, 1 lowercase, 1 uppercase, 1 numeric, 1 special character
    let regExPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{4}$/);
    let testEmail = regExEmail.test(req.body.email);
    let testPassword = regExPassword.test(req.body.password);
    // hasher le mot de passe, une fonction asynchrone qui prend du temps
    // utiliser la fonction hasher() pour crypte le mot de passe
    // on lui passe le mot de passe du corps de la requete qui sera passé par le frontend
    // 10 fois est suffi pour executer l'algorithme de hashage pour créer un mot de passe securisé
    if (testEmail && testPassword === true) {
        bcrypt.hash(req.body.password, 10)
            // recuperer le hash de mot de passe et enregisterr dans un neouveu user
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                // utiliser la methode save() pour l'enregistrer dans la base de données
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(() => res.status(400).json({ error }));
            })
            // capter l'erreur
            .catch(error => res.status(500).json({ error }));
    }
};

// la fonction login pour connecter des utilisateurs existant
exports.login = (req, res, next) => {

    let regExEmail = new RegExp(/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/);
    // It should be 4 characters, 1 lowercase, 1 uppercase, 1 numeric, 1 special character
    let regExPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{4}$/);
    let testEmail = regExEmail.test(req.body.email);
    let testPassword = regExPassword.test(req.body.password);
    // utilise la method findOne() de notre class User et nous lui passons un objet qui 
    if (testEmail && testPassword === true) {
    User.findOne({ email: req.body.email })
        // si la requete est bien passé, il faut récuperer l'enregistrement qui est dans la bdd
        .then(user => {
            if (user === null) {
                res.status(401).json({ mesage: 'Paire identifiant/mot de passe incorrecte!' })
            }
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
                        }
                        else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            });
                        }

                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    }
};

// create the folder routes and file user.js after controller/user.js


