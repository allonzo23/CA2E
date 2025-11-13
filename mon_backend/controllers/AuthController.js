// controllers/AuthController.js
// controllers/AuthController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Utilisateur } from "../models/Utilisateur.js";
import { Apprenant } from "../models/Apprenant.js";
import { Formateur } from "../models/Formateur.js";
import { Administrateur } from "../models/Administrateur.js";
import { Role } from "../models/Role.js";

dotenv.config();

const SALT = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(req, res) {
    try {
      const { nom, email, motdepasse, idrole, extra = {} } = req.body;

      // Vérification des champs obligatoires
      if (!nom || !email || !motdepasse || !idrole) {
        return res.status(400).json({ message: "Champs manquants" });
      }

      // Vérifie si l'email existe déjà
      const existing = await Utilisateur.findByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email déjà utilisé" });
      }

      // Vérifie si le rôle existe
      const role = await Role.findById(idrole);
      if (!role) {
        return res.status(400).json({ message: "Rôle invalide" });
      }

      // Hash du mot de passe
      const hashed = await bcrypt.hash(motdepasse, SALT);

      // Création du compte utilisateur principal
      const user = await Utilisateur.create({
        nom,
        email,
        motdepasse: hashed,
        idrole,
      });

      // Insertion spécifique selon le rôle
      switch (idrole) {
        case 1: // Apprenant
          if (!extra.filiere || !extra.niveau) {
            return res.status(400).json({ message: "Filière et niveau requis pour un apprenant" });
          }
          await Apprenant.create({
            idutilisateur: user.idutilisateur,
            filiere: extra.filiere,
            niveau: extra.niveau,
          });
          break;

        case 2: // Formateur
          if (!extra.specialite) {
            return res.status(400).json({ message: "Spécialité requise pour un formateur" });
          }
          await Formateur.create({
            idutilisateur: user.idutilisateur,
            specialite: extra.specialite,
          });
          break;

        case 3: // Administrateur
          if (!extra.poste) {
            return res.status(400).json({ message: "Poste requis pour un administrateur" });
          }
          await Administrateur.create({
            idutilisateur: user.idutilisateur,
            poste: extra.poste,
          });
          break;

        default:
          return res.status(400).json({ message: "Rôle non reconnu" });
      }

      // On retire le mot de passe avant d'envoyer la réponse
      delete user.motdepasse;

      return res.status(201).json({
        message: "Utilisateur créé avec succès",
        utilisateur: user,
        role: role.nomrole,
      });
    } catch (err) {
      console.error("Erreur dans AuthController.register:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  /**
   * Connexion utilisateur
   */
  static async login(req, res) {
    try {
      const { email, motdepasse } = req.body;
      console.log("Corps reçu :", req.body);

      if (!email || !motdepasse) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const userRow = await Utilisateur.findWithRoleByEmail(email);
      if (!userRow) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      // Vérifie le mot de passe
      const valid = await bcrypt.compare(motdepasse, userRow.motdepasse);
      if (!valid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Génération du token JWT
      const token = jwt.sign(
        {
          id: userRow.idutilisateur,
          role: userRow.nomrole,
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: process.env.JWT_EXPIRATION || "2h" }
      );

      delete userRow.motdepasse;

      return res.json({
        message: "Connexion réussie",
        token,
        utilisateur: userRow,
      });
    } catch (err) {
      console.error("Erreur dans AuthController.login:", err);
      return res.status(500).json({ error: err.message });
    }
  }
}


