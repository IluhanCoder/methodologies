import mongoose from "mongoose";

export interface RequirementTemp {
    title: string,
    description: string,
    category: string,
    projectId: mongoose.Types.ObjectId | undefined
}

export const requirementCategories = ["Functional", "Non-functional", "Business", "Technical"];