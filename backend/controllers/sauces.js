const Sauce = require("../models/sauces");

const fs = require("fs");

exports.createSauce = (req, res, next) => {
  // l'objet qui nous est envoyé dans le requête est chaîn de caracter, utiliser parse() pour parser cet objet sous le format JSON
  const sauceObject = JSON.parse(req.body.sauce);
  // supprimer le champ _id, il est genereré automatiqument par notre bdd
  delete sauceObject._id;
  // créer notre objet, utiliser l'operateur Spread pour copier les champs dans la corps de la requête
  const sauce = new Sauce({
    ...sauceObject,
    // generer l'url de l'image, il nous est donnée par multer
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    // http :// localhost:3000 /images/ nom de l'image ajouté

    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });
  // enregistrer cet objet dans la bdd
  // aller au app.js pour ajouter une route pour gerer images
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));

  console.log("💧 Create Sauce 💧");
  console.log(req.body);
};

// implementer la route GET afin qu'elle renvoie tous les sauces dans la bdd
exports.getAllSauces = (req, res, next) => {
  // renvoyer un tableau contenant tous les sauces dans notre bdd
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));

  console.log("💧 Gat All Sauces 💧");
  console.log(req.body);
};

exports.getOneSauce = (req, res, next) => {
  // pour trouver le sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));

  console.log("💧 Get one sauce 💧");
  console.log(req.params.id);
};

// deux possibilites, l'utilisateur mis a jour l'image ou pas
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        // s'il y a un objet, un file dans notre objet requête, nous recuperons notre objet en parsant la chaine de caracter
        // et recréons url de l'image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // s'il n y a pas un objet, un file, nous recevrons uniquement les données JSON.
      { ...req.body };

  // verifier si c'est bien l'utilisateur à qui appartient cet objet qui cherche a le modifier
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // si le userId dans la bdd est different de le userId qui vient de notre token, envoyer une erreur
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        // si c'est le bon utilisateur, mettre a jour notre enregistrement
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
  console.log("💧 Modify Sauce 💧");
  console.log(req.body);
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }
      // si c'est le bon utilisateur, on peut suprimer l'objet dans la bdd et l'image du system de fichier
      else {
        // recuperer l'URL qui est enregistrée, et recréer le chemin sur notre system du fichier
        const filename = sauce.imageUrl.split("/images/")[1];
        // pour la suppression, importer le package fs qui nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });

  console.log("💧 Delete Sauce 💧");
  console.log(req.params.id);
};

// 1) like = 1 (likes +1 ) Si like = 1, l'utilisateur aime (= like) la sauce
exports.likeDislike = (req, res, next) => {
  // chercher l'objet dans la bdd et utiliser findOne() pour trouver l'id de l'objet
  Sauce.findOne({ _id: req.params.id })
    .then((objectSauce) => {
      // rechercher userId dans le tableau userLiked, au début c'est faux, userLike ne contient pas userId, utiliser l'exclamation pour inverser que c'est true
      // la requête front like doit etre 1
      if (
        !objectSauce.usersLiked.includes(req.body.userId) &&
        req.body.like === 1
      ) {
        console.log("LIKE = 1");
        Sauce.updateOne(
          { _id: req.params.id },
          {
            // Utiliser l'opérateur $inc MongoDB qui incrémente un champ d'une valeur spécifiée
            $inc: { likes: 1 },
            // L'opérateur $push MongoDB ajoute une valeur spécifiée à un tableau.
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like +1" }))
          .catch((error) => res.status(400).json({ error }));

        // update the object database
      } else {
        console.log("LIKE != 1");
      }

      // 2) like = 0 (likes = 0), Si like = 0, l'utilisateur annule son like
      // Si le tableau userLiked contient le userId et like est 0, l'utilisateur annule son like

      if (
        objectSauce.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        console.log("LIKE = 0");
        Sauce.updateOne(
          { _id: req.params.id },
          {
            // To obtain 0 likes should be -1, we will increase from -1
            $inc: { likes: -1 },
            // Si l'utilisateur avait déjà aimé la sauce et qu'il l'a changée, l'opérateur $pull supprimera l'userId du tableau usersLiked
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() =>
            res
              .status(201)
              .json({ message: "User like 0, user a annulé son like!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        console.log("LIKE != 0");
      }

      // 3) like -1 (dislikes +1), Si like = -1, l'utilisateur n'aime pas la sauce.
      // I will search the userId in the array userDisliked in the object, at first it is false, userDisliked does not include userId, use ! to cenvert it true
      if (
        !objectSauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        console.log("DISLIKE = 1");
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "User disLike +1" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        console.log("DISLIKE != -1");
      }

      // 4) like = 0 (dislikes 0) If the user cancel her dislike, we will see likes = 0, and we will remove the userId from the array userDisliked
      if (
        objectSauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        console.log("DISLIKE = 0");
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() =>
            res
              .status(201)
              .json({ message: "User disLike 0, user a annulé son dislike!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        console.log("DISLIKE != 0");
      }
    })
    .catch((error) => res.status(404).json({ error }));

  console.log("💧 Like sauce 💧");
  console.log(req.body); // la requete sera envoyé par le body
  console.log("_id =" + " " + req.params.id); // récupérer l'id de l'URL de la requête
  console.log(req.params); // récupérer l'id de l'URL de la requête
};
