// controllers/UtilisateurController.js
import { UsersModel } from "../models/UsersModel.js";
import { pool } from "../db.js";

// Map roles: 1=Apprenant, 2=Formateur, 3=Admin
const ROLE = { APPRENANT: 1, FORMATEUR: 2, ADMIN: 3 };

export class UsersController {
  // Créer un utilisateur
  static async create(req, res) {
    try {
      const { nom, email, motdepasse, filiere, niveau, specialite, poste, role } = req.body;
      const user = await UsersModel.create({ nom, email, motdepasse, idrole: role });

      // Créer la table spécifique
      if (role === ROLE.APPRENANT) {
        await pool.query("INSERT INTO apprenant(idutilisateur,filiere,niveau) VALUES($1,$2,$3)", [
          user.idutilisateur,
          filiere,
          niveau,
        ]);
      } else if (role === ROLE.FORMATEUR) {
        await pool.query("INSERT INTO formateur(idutilisateur,specialite) VALUES($1,$2)", [
          user.idutilisateur,
          specialite,
        ]);
      } else if (role === ROLE.ADMIN) {
        await pool.query("INSERT INTO admin(idutilisateur,poste) VALUES($1,$2)", [
          user.idutilisateur,
          poste,
        ]);
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // Modifier un utilisateur
  static async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nom, email, motdepasse, filiere, niveau, specialite, poste, role } = req.body;
      const user = await UsersModel.update(id, { nom, email, motdepasse });

      if (role === ROLE.APPRENANT) {
        await pool.query("UPDATE apprenant SET filiere=$1, niveau=$2 WHERE idutilisateur=$3", [
          filiere,
          niveau,
          id,
        ]);
      } else if (role === ROLE.FORMATEUR) {
        await pool.query("UPDATE formateur SET specialite=$1 WHERE idutilisateur=$2", [specialite, id]);
      } else if (role === ROLE.ADMIN) {
        await pool.query("UPDATE admin SET poste=$1 WHERE idutilisateur=$2", [poste, id]);
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // Supprimer un utilisateur
  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await UsersModel.delete(id);
      res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // Lister utilisateurs par rôle
  static async listByRole(req, res) {
    try {
      const role = parseInt(req.params.role); // 1=Apprenant, 2=Formateur, 3=Admin
      const users = await UsersModel.findAllByRole(role);
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  // Récupérer un utilisateur
  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await UsersModel.findById(id);
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
