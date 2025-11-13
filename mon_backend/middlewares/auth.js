// middleware/auth.js
// middleware/auth.js
export const verifyRole = (roles = []) => {
  return (req, res, next) => {
    const user = req.user;

    // Vérifie que le token contient bien un rôle
    if (!user || !user.role) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Rend la vérification insensible à la casse (Maj/min)
    const userRole = user.role.toLowerCase();
    const allowed = roles.map(r => r.toLowerCase()).includes(userRole);

    if (!allowed) {
      return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
    }

    next();
  };
};




/*
export const verifyRole = (roles = []) => {
    return (req, res, next) => {
      const user = req.user; // supposons que req.user est rempli par ton auth JWT
      if (!user || !roles.includes(user.nomrole)) {
        return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
      }
      next();
    };
  };
  */