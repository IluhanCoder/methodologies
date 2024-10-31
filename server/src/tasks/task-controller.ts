import { Request, Response } from "express";
import taskService from "./task-service";
import { SubTaskCredentials } from "./task-types";
import { AuthenticatedRequest } from "../auth/auth-types";
import journalService from "../auth/journal-service";

export default new class TaskController {
    async addTask(req: AuthenticatedRequest, res: Response) {
        try {
            const { task } = req.body;
            const user = req.user;
            await taskService.addTask( task );
            await journalService.createdTask(user._id);
            return res.json({
                status: "success",
                message: "задачу було успішно додано"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getProjectTasks(req: Request, res: Response) {
        try {
            const { projectId } = req.params;
            const result = await taskService.getProjectTasks(projectId);
            res.status(200).json({
                status: "success",
                tasks: result
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async checkTask(req: AuthenticatedRequest, res: Response) {
        try {
            const { taskId } = req.params;
            const user = req.user;
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async unCheckTask(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            await taskService.unCheckTask(taskId);
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async setStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const {taskId} = req.params;
            const {status} = req.body;
            const user = req.user;
            await taskService.setStatus(taskId, Number(status));
            if(status === "done") await journalService.doneTask(user._id.toString());
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async assignTask(req: Request, res: Response) {
        try {
            const {taskId, userId} = req.body;
            await taskService.assignTask(taskId, userId);
            res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            const {taskId} = req.params;
            await taskService.deleteTask(taskId);
            res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getTaskById(req: Request, res: Response) {
        try {
            const {taskId} = req.params;
            const task = await taskService.getTaskById(taskId);
            res.status(200).json({
                status: "success",
                task
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async updateTask(req: AuthenticatedRequest, res: Response) {
        try {
            const {taskId} = req.params;
            const {task} = req.body;
            const user = req.user;
            await taskService.updateTask(taskId, task, user._id);
            res.status(200).json({
                status: "success",
                task
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getPhaseTasks(req: Request, res: Response) {
        try {
            const {phaseId} = req.params;
            const tasks = await taskService.getPhaseTasks(phaseId);
            return res.status(200).json({
                status: "success",
                tasks
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async createSubTask(req: Request, res: Response) {
        try {
            const {parentTaskId, name} = req.body;
            await taskService.createSubTask(parentTaskId, name);
            return res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async checkSubTask(req: Request, res: Response) {
        try {
            const {subTaskId} = req.params;
            await taskService.checkSubTask(subTaskId);
            return res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getSubTasks(req: Request, res: Response) {
        try {
            const {parentTaskId} = req.params;
            const result = await taskService.getSubTasks(parentTaskId);
            return res.status(200).json({
                status: "success",
                subTasks: result 
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async allSubTasksAreDone(req: Request, res: Response) {
        try {
            const {taskId} = req.params;
            const result = await taskService.allSubTasksAreDone(taskId);
            return res.status(200).json({
                status: "success",
                areDone: result 
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async deleteSubTask(req: Request, res: Response) {
        try {
            const {subTaskId} = req.params;
            await taskService.deleteSubTask(subTaskId);
            return res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}