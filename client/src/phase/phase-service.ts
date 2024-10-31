import $api from "../axios-setup";
import Phase, { PhaseCredentials } from "./phase-type";

export default new class PhaseService {
    async CreatePhase(credentials: PhaseCredentials) {
        await $api.post("/new-phase", { credentials });
    }

    async getProjectPhases(projectId: string, chargeId?: string): Promise<{status: string, phases: Phase[]}> {
        const result = await $api.post(`/phases/${projectId}`, {chargeId});
        return result.data as {status: string, phases: Phase[]};
    }

    async deletePhase(phaseId: string) {
        await $api.delete(`/phase/${phaseId}`);
    }

    async getActiveWaterFallIndex(projectId: string) {
        const result = await $api.get(`/active-index/${projectId}`);
        return result.data as {status: string, index: number};
    }

    async moveUp(phaseId: string) {
        await $api.get(`/move-up/${phaseId}`);
    }

    async moveDown(phaseId: string) {
        await $api.get(`/move-down/${phaseId}`);
    }

    async assignCharge(phaseId: string, userId: string) {
        await $api.patch(`/phase-charge/${phaseId}`, { userId });
    }
}