const jwt = require("jsonwebtoken");

// exporter une fonction qui sera notre middleware
module.exports = (req, res, next) => {
  try {
    // pour recuperer notre token nous recuperons le header et utilisons la methode split() pour diviser la chaine et obtenir la deuxime valeur separer par un espace
    const token = req.headers.authorization.split(" ")[1];
    console.log("🎉🎉🎉TOKEN🎉🎉🎉");
    console.log(req.headers.authorization);
    // maintenant nous avons le token il faut le decoder
    // utiliserc verify() pour recuperer l'id de l'utilisateur
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
    console.log("🎉🎉🎉decodedToken🎉🎉🎉");
    console.log(decodedToken);
    // Verifier que le token est valide
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
