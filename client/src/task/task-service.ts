import $api from "../axios-setup"
import Task, { SubTask, TaskCredentials, TaskResponse } from "./task-types";

export default new class TaskService {
    async getProjectTasks(projectId: string) {
        return (await $api.get(`project-tasks/${projectId}`)).data;
    }

    async newTask (credentials: TaskCredentials) {
        return (await $api.post("/task", {task: credentials})).data;
    }

    async checkTask(taskId: string) {
        return (await $api.patch(`/task-check/${taskId}`)).data;
    }

    async unCheckTask(taskId: string) {
        return (await $api.patch(`/task-uncheck/${taskId}`)).data;
    }

    async getBacklogTasks(backlogId: string) {
        return (await $api.get(`/backlog-tasks/${backlogId}`)).data;
    }

    async getSprintTasks(sprintId: string) {
        return (await $api.get(`/sprint-tasks/${sprintId}`)).data;
    }

    async setStatus(taskId: string, status: number) {
        return (await $api.patch(`/status/${taskId}`, {status})).data;
    }

    async assignTask(taskId: string, userId: string) {
        return (await $api.patch("/assign", {taskId, userId})).data;
    }       

    async deleteTask(taskId: string) {
        return (await $api.delete(`/task/${taskId}`)).data;
    }

    async getTaskById(taskId: string) {
        return (await $api.get(`/task/${taskId}`)).data;
    }

    async updateTask(taskId: string, task: TaskResponse) {
        return (await $api.put(`/task/${taskId}`, {task}));
    }

    async getPhaseTasks(phaseId: string): Promise<{status: string, tasks: TaskResponse[]}> {
        const result = await $api.get(`/phase-tasks/${phaseId}`);
        return result.data as {status: string, tasks: TaskResponse[]}
    }

    async createSubTask(parentTaskId: string, name: string) {
        const result = await $api.post(`/sub-task`, {parentTaskId, name});
    }

    async checkSubTask(subTaskId: string) {
        const result = await $api.get(`/check-sub-task/${subTaskId}`);
    }

    async getSubTasks(parentTaskId: string): Promise<{status: string, subTasks: SubTask[]}> {
        const result = (await $api.get(`/sub-tasks/${parentTaskId}`)).data;
        return result;
    }

    async allSubTasksAreDone(taskId: string): Promise<{status: string, areDone: boolean}> {
        const result = (await $api.get(`/subtasks-done/${taskId}`)).data;
        return {status: result.status, areDone: result.areDone};
    }

    async deleteSubTask(subTaskId: string) {
        const result = await $api.delete(`/sub-task/${subTaskId}`);
    }
}