import { requirementCategories, requirementCategoriesTranslations, RequirementTemp } from "./requirement-types";

interface LocalParams {
    requirement: RequirementTemp
}

const RequirementCard = ({ requirement }: LocalParams) => {
    return <div>
        <div>
            <label>Вимога:</label>
            <div>{requirement.title}</div>
        </div>
        <div>
            <label>Опис:</label>
            <div>{requirement.description}</div>
        </div>
        <div>
            <label>Категорія:</label>
            <div>{requirementCategoriesTranslations[requirementCategories.indexOf(requirement.category)]}</div>
        </div>
    </div>
}

export default RequirementCard;