const Sauce = require('../models/sauces');

const fs = require('fs');

//  CREATE SAUCE

exports.createSauce = (req, res, next) => {

  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject._id;
  // 🟠 delete _userId neden kullandik
  // delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    // 🟠 delete _userId yapinca bunuda ekliyoruz
    // userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    // http :// localhost:3000 /images/ nom de l'image ajouté 

    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }));

  console.log('💧Create Sauce💧');
  console.log(req.body);

};

// DISPLAY ALL SAUCE

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));

  console.log('💧Gat All Sauces💧');
  console.log(req.body);
};

// DISPLAY SPECIFIC SAUCE

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));

  console.log('💧Get one sauce💧');
  console.log(req.params.id);
};

// MODIFY

exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Not authorized' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
  console.log('💧Modify Sauce💧');
  console.log(req.body);
};

// DELETE 

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });

        return;
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });

      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });

  console.log('💧Delete Sauce💧');
  console.log(req.params.id);
};


exports.likeDislike = (req, res, next) => {

  // Search the object in the data base, use the method findOne() to find the id of the object

  Sauce.findOne({ _id: req.params.id })
    .then((objectSauce) => {

      // Kullanıcı beğenirse 1, beğenmezse -1, daha önce beğendiğini veya beğenmediğini geri alırsa 0 veya ne beğenir ne de beğenmezse 0.
      // Use the method js includes(), returns true if a string contains a specified string, otherwise it returns false.


      // 1) like = 1 (likes +1 ) Si like = 1, l'utilisateur aime (= like) la sauce
      // I will search userId in the array userLiked, at first it is false, userLiked does not include userId, use ! to cenvert it true
      // and the request front like must be 1
      if (!objectSauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        console.log("LIKE = 1");
        Sauce.updateOne({ _id: req.params.id },
          {
            // use the operator $inc mongoDB which increments a field by a specified value and has the following form:
            $inc: { likes: 1 },
            // The $push operator MangoDB appends a specified value to an array.
            $push: { usersLiked: req.body.userId }  //$pull Supprime tous les éléments du tableau qui correspondent à une requête spécifiée.
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like +1" }))
          .catch((error) => res.status(400).json({ error }));

        // update the object database
      }
      else { console.log('LIKE != 1'); }

      // 2) like = 0 (likes = 0), Si like = 0, l'utilisateur annule son like 
      // If userLiked includes the userId and like is 0 

      if (objectSauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        console.log("LIKE = 0");
        Sauce.updateOne({ _id: req.params.id },
          {
            // To obtain 0 likes should be -1, we will increase from -1
            $inc: { likes: -1 },
            // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
            // If user had already liked the sauce and he/she changed it, $pull operator will remove the userId from the array usersLiked 
            $pull: { usersLiked: req.body.userId }
          }
        )
          .then(() => res.status(201).json({ message: "User like 0, user a annulé son like!" }))
          .catch((error) => res.status(400).json({ error }));
      }
      else { console.log('LIKE != 0'); }

      // 3) like -1 (dislikes +1), Si like = -1, l'utilisateur n'aime pas la sauce.
      // I will search the userId in the array userDisliked in the object, at first it is false, userDisliked does not include userId, use ! to cenvert it true
      // And when the user disliked the sauce, we will see in the console that dislikes = -1
      if (!objectSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        console.log("DISLIKE = 1");
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId }
          }
        )
          .then(() => res.status(201).json({ message: "User disLike +1" }))
          .catch((error) => res.status(400).json({ error }));
      } else { console.log('DISLIKE != -1'); }


      // 4) like = 0 (dislikes 0) If the user cancel her dislike, we will see likes = 0, and we will remove the userId from the array userDisliked
      if (objectSauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        console.log("DISLIKE = 0");
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId }
          }
        )
          .then(() => res.status(201).json({ message: "User disLike 0, user a annulé son dislike!" }))
          .catch((error) => res.status(400).json({ error }));
      } else { console.log('DISLIKE != 0'); }
    })
    .catch((error) => res.status(404).json({ error }));

  console.log('💧Like sauce💧');
  console.log(req.body); // la requete sera envoyé par le body
  console.log("_id =" + " " + req.params.id); // récupérer l'id de l'URL de la requête
  console.log(req.params); // récupérer l'id de l'URL de la requête
};