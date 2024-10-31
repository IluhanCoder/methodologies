import { useEffect, useState } from "react";
import { requirementCategories, requirementCategoriesPluralTranslations, requirementCategoriesTranslations, RequirementTemp } from "./requirement-types";
import LoadingScreen from "../misc/loading-screen";
import requirementService from "./requirement-service";

interface LocalParams {
    projectId: string
}

const RequirementsMapper = ({projectId}: LocalParams) => {
    const [requirements, setRequirements] = useState<RequirementTemp[]>();

    const getRequirements = async () => {
        const result = await requirementService.getRequirements(projectId);
        setRequirements([...result.requirements]);
    }

    useEffect(() => {
        getRequirements();
    }, []);

    if(requirements) return <div>
        {
            requirementCategories.map((category: string) => {
                const filteredRequirements = requirements.filter((requirement: RequirementTemp) => requirement.category === category);
                return <div>
                    <div>{requirementCategoriesPluralTranslations[requirementCategories.indexOf(category)]}</div>
                    {filteredRequirements.map((requirement: RequirementTemp) => <div>
                        <div>{requirement.title}</div>
                        <div>{requirement.description}</div>
                    </div>)}
                </div>
            })
        }
    </div>
    else return <LoadingScreen/>
}

export default RequirementsMapper;