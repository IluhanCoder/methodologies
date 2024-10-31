import { Request, Response } from "express";
import requirementService from "./requirement-service";
import { RequirementTemp } from "./requirement-types";

export default new class RequirementService {
    async newRequirements(req: Request, res: Response) {
        try {
            const { requirements } = req.body as {requirements: RequirementTemp[]};
            await requirementService.newRequirements(requirements);
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

    async getRequirements(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const result: RequirementTemp[] = await requirementService.getProjectRequirements(projectId);
            return res.json({
                status: "success",
                requirements: result
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