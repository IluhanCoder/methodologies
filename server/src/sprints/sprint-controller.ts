import { Request, Response } from "express";
import sprintService from "./sprint-service";
import SprintError from "./sprint-errors";

export default new class SprintController {
    async createSprint(req: Request, res: Response) {
        try {
            const {backlogId, projectId, name} = req.body;
            console.log(projectId);
            await sprintService.createSprint(name, backlogId, projectId);
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            if(error instanceof SprintError) {
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                }) 
            }
            else { 
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500)
                throw error;
            }
        } 
    }

    async getBacklogSprints(req: Request, res: Response) {
        try {
            const {backlogId} = req.params;
            const sprints = await sprintService.getBacklogSprints(backlogId);
            res.status(200).json({
                status: "success",
                sprints
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getSprintTasks(req: Request, res: Response) {
        try {
            const {sprintId} = req.params;
            const tasks = await sprintService.getSprintTasks(sprintId);
            res.status(200).json({
                status: "success",
                tasks
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async pushTask(req: Request, res: Response) {
        try {
            const {taskId, sprintId} = req.body;
            await sprintService.pushTask(taskId, sprintId);
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

    async pullTaskIntoBacklog(req: Request, res: Response) {
        try {
            const {taskId, backlogId} = req.body;
            await sprintService.pullTaskIntoBacklog(taskId, backlogId);
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

    async editSprint(req: Request, res: Response) {
        try {
            const {sprintId} = req.params;
            const {name, goal, startDate, endDate} = req.body;
            await sprintService.editSprint(sprintId, name, goal, new Date(startDate), new Date(endDate));
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            console.log(error);
            if(error instanceof SprintError) {
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                }) 
            }
            else { 
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500)
                throw error;
            }
        }
    }

    async getSprintById(req: Request, res: Response) {
        try {
            const {sprintId} = req.params;
            const sprint = await sprintService.getSprintById(sprintId);
            res.status(200).json({
                status: "success",
                sprint
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
    
    async deleteSprint(req: Request, res: Response) {
        try {
            const {sprintId} = req.params;
            await sprintService.deleteSprint(sprintId);
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
}