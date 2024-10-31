import $api from "../axios-setup";
import { RequirementTemp } from "./requirement-types";

export default new class RequirementService {
    async getRequirements(projectId: string): Promise<{status: string, requirements: RequirementTemp[]}> {
        const result = (await $api.get(`/requirements/${projectId}`)).data;
        return result;
    }
}