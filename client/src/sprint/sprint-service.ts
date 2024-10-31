import $api from "../axios-setup"
import errorStore from "../errors/error-store";
import { SprintPutRequest } from "./sprint-types";

export default new class SprintService {
    async createSprint(name: string, backlogId: string | undefined, projectId: string | undefined) {
        try { 
            return (await $api.post("/sprint", {backlogId, projectId, name})).data;
        } catch (error: any) {
            if(error?.code === "ERR_BAD_REQUEST")  {
                errorStore.pushError(error?.response?.data?.message);
            }
        }
    }

    async getSprints(backlogId: string) {
        return (await $api.get(`/sprints/${backlogId}`)).data;
    }

    async pushTask(taskId: string, sprintId: string) {
        return (await $api.post(`/sprint-task`,{taskId, sprintId})).data;
    }

    async pullTask(taskId: string, backlogId: string) {
        return (await $api.post("/sprint-pull-task",{taskId, backlogId})).data;
    }
    
    async editSprint(sprintId: string, newData: SprintPutRequest) {
        try {
            return (await $api.put(`/sprint/${sprintId}`, {...newData})).data;
        } catch (error: any) {
            if(error?.code === "ERR_BAD_REQUEST")  {
                console.log(error.response)
                errorStore.pushError(error?.response?.data?.message);
            }
        }
    }

    async getSprintById(sprintId: string) {
        return (await $api.get(`/sprint/${sprintId}`)).data;
    }

    async deleteSprint(sprintId: string) {
        return (await $api.delete(`/sprint/${sprintId}`)).data;
    }
}