import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../controllers/tasks.controller";
import {db} from "../../firebase";
import * as admin from "firebase-admin";
import {Request, Response} from "express";

jest.mock("../../firebase", () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock("../../utils/dates.service", () => ({
  formatTimestamp: jest.fn((ts) => "formatted-timestamp"),
}));

describe("Tasks Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      headers: {x_email: "test@example.com"},
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should return formatted tasks", async () => {
      const mockDocs = [
        {id: "1", data: () => ({title: "Test", createdAt: "timestamp1"})},
        {id: "2", data: () => ({title: "Another", createdAt: "timestamp2"})},
      ];

      const getMock = jest.fn().mockResolvedValue({docs: mockDocs});
      const orderByMock = jest.fn(() => ({get: getMock}));
      const whereMock2 = jest.fn(() => ({orderBy: orderByMock}));
      const whereMock1 = jest.fn(() => ({where: whereMock2}));
      (db.collection as jest.Mock).mockReturnValue({where: whereMock1});

      await getTasks(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith([
        {
          id: "1",
          createdAt: "formatted-timestamp",
          title: "Test",
        },
        {
          id: "2",
          createdAt: "formatted-timestamp",
          title: "Another",
        },
      ]);
    });

    it("should handle errors", async () => {
      (db.collection as jest.Mock).mockImplementation(() => {
        throw new Error("Firestore error");
      });

      await getTasks(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: "Error al obtener tareas"});
    });
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      req.body = {title: "New", description: "Desc", completed: false};
      const addMock = jest.fn().mockResolvedValue({id: "task-id"});
      (db.collection as jest.Mock).mockReturnValue({add: addMock});

      const now = admin.firestore.Timestamp.now();
      jest.spyOn(admin.firestore.Timestamp, "now").mockReturnValue(now);

      await createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: "task-id",
        title: "New",
        description: "Desc",
        completed: false,
        email: "test@example.com",
        createdAt: "formatted-timestamp",
      });
    });

    it("should handle errors", async () => {
      (db.collection as jest.Mock).mockReturnValue({
        add: jest.fn().mockRejectedValue(new Error("Failed")),
      });

      await createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: "Error al crear tarea"});
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      req.params = {id: "123"};
      req.body = {title: "Updated", description: "Updated", completed: true};

      const updateMock = jest.fn().mockResolvedValue(undefined);
      const getMock = jest.fn().mockResolvedValue({exists: true});
      const docMock = {get: getMock, update: updateMock};
      (db.collection as jest.Mock).mockReturnValue({doc: () => docMock});

      await updateTask(req as Request, res as Response);

      expect(updateMock).toHaveBeenCalledWith({
        title: "Updated",
        description: "Updated",
        completed: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tarea actualizada correctamente",
      });
    });

    it("should return 404 if task not found", async () => {
      const docMock = {
        get: jest.fn().mockResolvedValue({exists: false}),
      };
      (db.collection as jest.Mock).mockReturnValue({doc: () => docMock});

      req.params = {id: "nonexistent"};

      await updateTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({error: "Tarea no encontrada"});
    });

    it("should handle errors", async () => {
      (db.collection as jest.Mock).mockImplementation(() => {
        throw new Error("Update error");
      });

      req.params = {id: "err"};

      await updateTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json)
        .toHaveBeenCalledWith({error: "Error al actualizar tarea"});
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const deleteMock = jest.fn().mockResolvedValue(undefined);
      const docMock = {delete: deleteMock};
      (db.collection as jest.Mock).mockReturnValue({doc: () => docMock});

      req.params = {id: "123"};

      await deleteTask(req as Request, res as Response);

      expect(deleteMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({mensaje: "Tarea eliminada"});
    });

    it("should handle delete errors", async () => {
      (db.collection as jest.Mock).mockReturnValue({
        doc: () => ({
          delete: jest.fn().mockRejectedValue(new Error("Delete error")),
        }),
      });

      req.params = {id: "123"};

      await deleteTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({error: "Error al eliminar tarea"});
    });
  });
});
