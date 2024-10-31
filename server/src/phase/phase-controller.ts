import { Request, Response } from "express";
import { PhaseCredentials } from "./phase-type";
import phaseService from "./phase-service";

export default new class PhaseController {
    async createPhase(req: Request, res: Response) {
        try {
            const { credentials } = req.body as { credentials: PhaseCredentials };
            await phaseService.createPhase( credentials );
            return res.json({
                status: "success"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
    
    async getProjectPhases(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const {chargeId} = req.body;
            const phases = await phaseService.getProjectPhases(projectId, chargeId);
            return res.json({
                status: "success",
                phases
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async deletePhase(req: Request, res: Response) {
        try {
            const {phaseId} = req.params;
            await phaseService.deletePhase(phaseId);
            return res.json({
                status: "success"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getActiceWaterfallIndex(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const index = await phaseService.getActiveWaterfallIndex(projectId);
            return res.json({
                status: "success",
                index
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async moveUp(req: Request, res: Response) {
        try {
            const {phaseId} = req.params;
            await phaseService.moveUp(phaseId);
            return res.json({
                status: "success"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async moveDown(req: Request, res: Response) {
        try {
            const {phaseId} = req.params;
            await phaseService.moveDown(phaseId);
            return res.json({
                status: "success"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async assignCharge(req: Request, res: Response) {
        try {
            const {phaseId} = req.params as {phaseId: string | undefined};
            const {userId} = req.body as {userId: string | undefined};
            await phaseService.assignCharge(phaseId, userId);
            return res.json({
                status: "success"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}