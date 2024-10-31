import mongoose from "mongoose";
import phaseModel from "./phase-model";
import Phase, { PhaseCredentials } from "./phase-type";
import Task, { TaskResponse } from "../tasks/task-types";
import TaskModel from "../tasks/task-model";
import ProjectModel from "../projects/project-model";

export default new class PhaseService {
    async createPhase(credentials: PhaseCredentials) {
        await phaseModel.create(credentials);
    }

    async getProjectPhases(projectId: string, chargeId?: string) {
        const convertedProjectId = new mongoose.Types.ObjectId(projectId);
        const convertedChargeId = new mongoose.Types.ObjectId(chargeId);
        const pipeline = [];
        if(chargeId) pipeline.push({$match: {charge: convertedChargeId}});
        console.log(pipeline);
        const result = await phaseModel.aggregate([
            {
                $match: {
                    projectId: convertedProjectId
                }
            },
            ...pipeline,
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "charge",
                    as: "charge"
                }
            },
            {
                $unwind: {
                    path: '$charge',
                    preserveNullAndEmptyArrays: true, // Keeps tasks even if they don't have a matching project
                }
            },
            {
                $sort: {
                    "index": 1
                }
            },
            {
                $project: {
                    _id: 1,
                    projectId: 1,
                    index: 1,
                    name: 1,
                    startDate: 1,
                    endDate: 1,
                    goal: 1,
                    charge: 1
                }
            }
        ]);
        return result;
    }

    async deletePhase(phaseId: string) {
        const deletedPhase: Phase = await phaseModel.findByIdAndDelete(phaseId);
        const phasesToModify: Phase[] = await phaseModel.find({projectId: deletedPhase.projectId, index: {$gt: deletedPhase.index}});
        phasesToModify.map(async (phase: Phase) => {
            const newIndex = phase.index - 1;
            await phaseModel.findByIdAndUpdate(phase._id.toString(), {index: newIndex});
        })
    }

    async getActiveWaterfallIndex(projectId: string) {
        const convertedProjectId = new mongoose.Types.ObjectId(projectId);
        const phases: Phase[] = await phaseModel.find({ projectId: convertedProjectId });

        const sortedPhases = phases.sort((a: Phase, b: Phase) => a.index - b.index);

        const allTasksAreDone = async (phaseId: mongoose.Types.ObjectId) => { 
            const tasks: Task[] = await TaskModel.find({ phaseId });
            return tasks.length > 0 && !tasks.some((task: Task) => task.status !== "done") 
        } 

        let index = 0;

        for(;index < sortedPhases.length && await allTasksAreDone(sortedPhases[index]._id); index++);

        return index;
    }

    async getPhasesAmount(projectId: string): Promise<number> {
        const convertedProjectId = new mongoose.Types.ObjectId(projectId);
        const phases = await phaseModel.find({projectId: convertedProjectId});
        return phases.length;
    }

    async moveUp(phaseId: string) {
        const phaseData: Phase = await phaseModel.findById(phaseId);
        const oldIndex = phaseData.index;

        if(oldIndex > 0) {
            await phaseModel.findOneAndUpdate({projectId: phaseData.projectId, index: oldIndex - 1}, {index: oldIndex});
            await phaseModel.findByIdAndUpdate(phaseId, {index: oldIndex - 1});
        }
    }

    async moveDown(phaseId: string) {
        const phaseData: Phase = await phaseModel.findById(phaseId);
        const oldIndex = phaseData.index;
        const phasesAmount = await this.getPhasesAmount(phaseData.projectId.toString());

        if(oldIndex < phasesAmount) {
            await phaseModel.findOneAndUpdate({projectId: phaseData.projectId, index: oldIndex + 1}, {index: oldIndex});
            await phaseModel.findByIdAndUpdate(phaseId, {index: oldIndex + 1});
        }
    }

    async assignCharge(phaseId: string, userId: string) {
        const convertedUserId = new mongoose.Types.ObjectId(userId);
        await phaseModel.findByIdAndUpdate(phaseId, {charge: convertedUserId});
    }
}