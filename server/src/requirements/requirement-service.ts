import mongoose from "mongoose";
import RequirementModel from "./requirement-model";
import { RequirementTemp } from "./requirement-types";

export default new class RequirementService {
    async newRequirements (requirements: RequirementTemp[]) {
        requirements.map(async (req: RequirementTemp) => {
            await RequirementModel.create(req);
        }) 
    }

    async deleteProjectRequirements (projectId: string) {
        await RequirementModel.deleteMany({projectId: new mongoose.Types.ObjectId(projectId)});
    }

    async getProjectRequirements(projectId: string) {
        const convertedProjectId = new mongoose.Types.ObjectId(projectId);
        const result: RequirementTemp[] = await RequirementModel.find({projectId: convertedProjectId});
        console.log(result);
        return result;
    }
}