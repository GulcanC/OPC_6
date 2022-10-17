// 3 installer et importer bcrypt, pour hasher le password
const bcrypt = require("bcrypt");

const User = require("../models/user");

const jwt = require("jsonwebtoken");

// 1 la fonction signup() pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  console.log("🎉🎉🎉USER SIGNUP🎉🎉🎉");
  console.log(req.body);

  // It should be 4 characters, 1 lowercase, 1 uppercase, 1 numeric, 1 special character
  let regExPassword = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{4}$/
  );
  let regExEmail = new RegExp(
    /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/
  );

  let testEmail = regExEmail.test(req.body.email);
  let testPassword = regExPassword.test(req.body.password);

  if (testEmail && testPassword === true) {
    // 2 hasher le mot de passe
    // 4 appeler la fonction bcrypte.hash() pour crypte le mot de passe
    // 5 on lui passe le mot de passe du corps de la requête qui sera passé par le frontend
    bcrypt
      // 6 executer l'algorithme de hashage 10 fois, pour créer un mot de passe sécurise
      .hash(req.body.password, 10)
      // 7 recuperer le hash de mot de passe et enregisterr dans un neouveu user
      .then((hash) => {
        const user = new User({
          // 8 passer l'addresse email qui fournie dans le corps de la requête
          email: req.body.email,
          // 9 passer le mot de passe pour enregistrer le hash
          password: hash,
        });
        // 10 utiliser la methode save() pour l'enregistrer l'utilisateur dans la base de données
        user
          .save()
          .then(() =>
            res
              .status(201)
              .json({ message: "Utilisateur créé et sauvegardée!" })
          )
          .catch(() => res.status(400).json({ error }));
      })

      .catch((error) => res.status(500).json({ error }));
  }
};

// 1 verifier si un utilisateur existe dans notre bdd et le mot de passe transmis par le client correspond à cet utilisateur
exports.login = (req, res, next) => {
  console.log("🎉🎉🎉USER LOGIN🎉🎉🎉");
  console.log(req.body);

  // 2 utilise la method findOne() et nous lui passons un objet avec un champ email et la valeur qui nous a été énvoyé par le client
  User.findOne({ email: req.body.email })
    // 3 si la requete est bien passé, il faut récuperer l'enregistrement qui est dans la bdd
    .then((user) => {
      // 4 si la valeur est null, l'utilisateur n'existait pas dans notre bdd
      if (user === null) {
        res
          .status(401)
          .json({ mesage: "Paire identifiant/mot de passe incorrecte!" });
      }
      // 5 si nous avons une valeur, on compare le mot de passe de la bdd avec le mot de passe qui nous a été transmis
      else {
        bcrypt
          .compare(req.body.password, user.password)
          // 6 On va regarder la valeur, user
          .then((valid) => {
            // 7 si elle n'est pas valide, c'est a dire il ya une erreur d'authentification = le mot de passe n'est pas correct
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire login/mot de passe incorrecte" });
            } else {
              // 8 si le mot de passe est correct nous avons le userId et le token
              // 9 on installe un package jsonwebtoken qui nous permete de créer des token et de les veérifier
              res.status(200).json({
                userId: user._id,
                // 10 pour le token, appeler la fonction sign
                token: jwt.sign(
                  // 11 le premiere argument creer un objet avec le userId, on est sur que cette requete correspond bien a ce userId
                  { userId: user._id },
                  // 12 deuxime argument est la clé secrete pour l'encodage, utiliser une chaine de caracters plus longue et tres aleatoire pour securiser l'encodage
                  `${process.env.JWT_KEY_TOKEN}`,
                  // 13 expiration pour notre token
                  { expiresIn: "12h" }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
