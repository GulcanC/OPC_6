const Sauce = require('../models/sauces');

const fs = require('fs');

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
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

/* exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // on vérifie si lors de la modif une image a été modifiée - utilisation de l'opérateur ternaire oui/non
    // si req.file est vrai et donc qu'il existe les 4 lignes ci-dessous sont prise en compte
    {
      ...JSON.parse(req.body.sauce), // comme on a une image on doit la traduire de chaine de caractère (reçu du frontend) en objet js exploitable (d'où le json.parse)
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // sinon (req.file est faux et donc n'existe pas), on reprend juste l'ensemble de ce qu'envoi le front sans parser...

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // 1er paramètre et 2nd paramétre avec les nouvelles données à enregistrer dans la bdd
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};  */


 exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}; 


/* exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // on cherche l'id qui correspond à celui qu'on veut supprimé (envoyé par la requête front)
    .then(sauce => { // il nous renvoie la sauce en question à surpprimer
      const filename = sauce.imageUrl.split('/images/')[1]; // on récupére son nom,on split la chaine de caractères au niveau de images puis on prend la 2nd valeur
      fs.unlink(`images/${filename}`, () => { // on appelle une fonciton de fs 'unlike' pour supprimer un fichier - elle prend en paramétre le dossier et le nom de l'image
        Sauce.deleteOne({ _id: req.params.id }) // dans le callback de fs.unlike / une fois l'image supprimé on supprime le reste des info de la sauce
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};  */


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        //  if (sauce.userId != req.auth.userId) {
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
}; 