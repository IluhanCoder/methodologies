import { UserResponse } from "../user/user-types"

interface Task {
    _id: string,
    projectId: string | null,
    sprintId: string | null,
    backlogId: string | null,
    name: string,
    desc: string,
    isChecked: boolean,
    createdBy: string,
    created: Date,
    checkedDate: Date | null,
    executors: string[],
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export default Task;

export interface TaskCredentials {
    name: string,
    desc: string,
    backlogId: string | null,
    projectId: string | null,
    sprintId: string | null,
    phaseId: string | null,
    createdBy: string,
    executors?: string[],
    requirements: string
}

export interface TaskResponse {
    _id: string,
    name: string,
    desc: string,
    backlogId: string | null,
    projectId: string | null,
    sprintId: string | null,
    phaseId: string | null,
    isChecked: boolean,
    createdBy: string,
    created: Date,
    checkedDate: Date | null,
    executors: UserResponse[],
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export interface SubTask {
    _id: string,
    name: string,
    parentTask: string,
    isChecked: boolean
}