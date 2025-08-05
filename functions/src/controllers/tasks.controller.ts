import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {db} from "../firebase";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("tasks")
    .where("email", "==", req.body.user.email)
    .orderBy('createdAt', 'desc')
    .get();

    const tareas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
    createdAt: admin.firestore.Timestamp.now(),
  };

  try {
    const docRef = await db.collection("tasks").add(newTask);
    res.status(201).json({id: docRef.id, ...newTask});
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({error: "Error al crear tarea"});
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
