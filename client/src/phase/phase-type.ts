import { UserResponse } from "../user/user-types"

export default interface Phase {
    _id: string,
    projectId: string
    index: number
    name: string,
    startDate: Date,
    endDate: Date,
    goal: string,
    charge: UserResponse
}

export interface PhaseCredentials {
    projectId: string,
    index: number,
    name: string,
    startDate: Date,
    endDate: Date,
    goal: string
}
