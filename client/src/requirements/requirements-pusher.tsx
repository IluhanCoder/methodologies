import { ChangeEvent, useState } from "react";
import { requirementCategories, requirementCategoriesTranslations, RequirementTemp } from "./requirement-types";
import { submitButtonStyle } from "../styles/button-syles";
import RequirementCard from "./requirement-card";

interface LocalParams {
    requirementsState: [RequirementTemp[], React.Dispatch<React.SetStateAction<RequirementTemp[]>>]
}

const RequirementsPusher = ({ requirementsState }: LocalParams) => {
    const [requirements, setRequirements] = requirementsState;

    const defaultFormData = {
        title: "",
        description: "",
        category: requirementCategories[0],
        projectId: undefined
    }

    const [formData, setFormData] = useState<RequirementTemp>(defaultFormData);

    const handleChange = (event: any) => {
        console.log(event.target.name);
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };   

    const handlePush = () => {
        setRequirements([...requirements, formData]);
        setFormData({...defaultFormData});
    }

    //todo: clear form inputs when push

    return <div>
        <div>
            <div>
                <label>Вимога:</label>
                <input type="text" name="title" onChange={handleChange}/>
            </div>
            <div>
                <label>Опис вимоги:</label>
                <input type="text" name="description" onChange={handleChange}/>
            </div>
            <div>
                <label>Категорія:</label>
                <select name="category" onChange={handleChange}>
                   {
                    requirementCategories.map((category: string, index: number) => 
                        <option value={category}>
                            {requirementCategoriesTranslations[index]}
                        </option>
                    )
                   }
                </select>
            </div>
            <div>
                <button type="button" className={submitButtonStyle} onClick={handlePush}>додати</button>
            </div>
        </div>
        <div>
            {
                requirements.map((req: RequirementTemp) => <div>
                        <RequirementCard requirement={req}/>
                    </div>)
            }
        </div>
    </div>
}

export default RequirementsPusher;