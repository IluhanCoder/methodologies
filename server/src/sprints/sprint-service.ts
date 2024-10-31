import mongoose, { mongo } from "mongoose";
import sprintModel from "./sprint-model";
import backlogModel from "../backlog/backlog-model";
import TaskModel from "../tasks/task-model";
import Sprint, { SprintCredentials } from "./sprint-types";
import ProjectModel from "../projects/project-model";
import Project from "../projects/project-types";
import SprintError from "./sprint-errors";

export default new class SprintService {
    async createSprint (name: string, backlogId: string | undefined, projectId: string | undefined) {
        const project: Project = await ProjectModel.findById(projectId);

        const newSprint: SprintCredentials = {
            backlogId: backlogId ? new mongoose.Types.ObjectId(backlogId) : null,
            projectId: projectId ? new mongoose.Types.ObjectId(projectId) : null,
            name,
            goal: "",
            startDate: project.startDate,
            endDate: project.endDate
        }
        await sprintModel.create(newSprint);
    }

    async getBacklogSprints (backlogId: string) {
        const result = await sprintModel.find({backlogId: new mongoose.Types.ObjectId(backlogId)})
        return result;
    }

    async getSprintTasks(sprintId: string) {
      const result = await TaskModel.find({sprintId: new mongoose.Types.ObjectId(sprintId)})
      return result;
    }

  async pushTask(taskId: string, sprintId: string) {
    const convertedSprintId = new mongoose.Types.ObjectId(sprintId);
    await TaskModel.findByIdAndUpdate(taskId, {backlogId: null, sprintId: convertedSprintId, projectId: null});
  }

  async pullTaskIntoBacklog(taskId: string, backlogId: string) {
    const convertedBacklogId = new mongoose.Types.ObjectId(backlogId);
    await TaskModel.findByIdAndUpdate(taskId, {backlogId: convertedBacklogId, sprintId: null, projectId: null});
  }

  async editSprint(sprintId: string, name: string, goal: string, startDate: Date, endDate: Date) {
    const sprint = await sprintModel.findById(sprintId);
    const backlog = await backlogModel.findById(sprint.backlogId);
    const project = await ProjectModel.findById(backlog.projectId);
    console.log(project);
    if(startDate.getTime() < project.startDate.getTime() || endDate.getTime() > project.endDate.getTime()) throw SprintError.BadDates();
    await sprintModel.findByIdAndUpdate(sprintId, {name, goal, startDate, endDate});
  }

  async getSprintById(sprintId: string) {
    return await sprintModel.findById(sprintId);
  }

  async deleteSprint(sprintId: string) {
    return await sprintModel.findByIdAndDelete(sprintId);
  }
}