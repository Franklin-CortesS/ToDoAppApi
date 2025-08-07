import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {db} from "../firebase";
import {formatTimestamp} from "../utils/dates.service";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("tasks")
      .where("email", "==", req.headers.x_email)
      .where("completed", "==", false)
      .orderBy("createdAt", "desc")
      .get();
    const tareas = snapshot.docs.map((doc) => {
      const data = doc.data();
      const formattedCreatedAt = formatTimestamp(data.createdAt);

      return {
        id: doc.id,
        ...data,
        createdAt: formattedCreatedAt,
      };
    });

    res.json(tareas);
  } catch (error) {
    res.status(500).json({error: "Error al obtener tareas"});
  }
};

export const createTask = async (req: Request, res: Response) => {
  const {title, description, completed} = req.body;

  const newTask = {
    title,
    description,
    completed,
    email: req.headers.x_email,
    createdAt: admin.firestore.Timestamp.now(),
  };

  try {
    const docRef = await db.collection("tasks").add(newTask);
    res.status(201).json({
      id: docRef.id,
      ...newTask,
      createdAt: formatTimestamp(newTask.createdAt),
    });
  } catch (error) {
    res.status(500).json({error: "Error al crear tarea"});
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {title, description, completed} = req.body;

  try {
    const docRef = db.collection("tasks").doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({error: "Tarea no encontrada"});
    }

    await docRef.update({
      title,
      description,
      completed,
    });

    return res.status(200).json({message: "Tarea actualizada correctamente"});
  } catch (error) {
    return res.status(500).json({error: "Error al actualizar tarea"});
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await db.collection("tasks").doc(id).delete();
    res.status(200).json({mensaje: "Tarea eliminada"});
  } catch (error) {
    res.status(500).json({error: "Error al eliminar tarea"});
  }
};
