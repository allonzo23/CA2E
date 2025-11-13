import { assignFormateurToFormation, getFormateursByFormation, getFormationsByFormateur } from "../models/formationFormateurModel.js";

export const assigner = async (req, res) => {
  try {
    const { idformation, idformateur } = req.body;
    const data = await assignFormateurToFormation(idformation, idformateur);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFormateursDeFormation = async (req, res) => {
  try {
    const data = await getFormateursByFormation(req.params.idformation);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFormationsDuFormateur = async (req, res) => {
  try {
    const data = await getFormationsByFormateur(req.params.idformateur);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
