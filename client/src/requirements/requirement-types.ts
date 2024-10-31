export interface RequirementTemp {
    title: string,
    description: string,
    category: string,
    projectId: string | undefined
}

export const requirementCategories = ["Functional", "Non-functional", "Business", "Technical"];

export const requirementCategoriesTranslations = ["Функціональна вимога", "Нефункціональна вимога", "Бізнес-вимога", "Технічна вимога"];
export const requirementCategoriesPluralTranslations = ["Функціональні вимоги", "Нефункціональні вимоги", "Бізнес-вимоги", "Технічні вимоги"];