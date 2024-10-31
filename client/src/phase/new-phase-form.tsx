import { ChangeEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import Phase, { PhaseCredentials } from "./phase-type";
import DatePicker from "../analytics/date-picker";
import phaseService from "./phase-service";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";

interface LocalParams {
    projectId: string,
    callBack?: () => void,
    newPhaseHandler: (formData: PhaseCredentials) => Promise<void>
}

const NewPhaseForm = ({projectId, callBack, newPhaseHandler}: LocalParams) => {
    const currentDate = new Date;

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };   

    const [formData, setFormData] = useState<PhaseCredentials>({
        projectId,
        index: 0,
        name: "",
        startDate: currentDate,
        endDate: new Date((new Date()).setDate(currentDate.getDate() + 10)),
        goal: ""
    });

    const handleStart = (date: Date) => {
        if(formData) {
            if(date >= formData.endDate) return;
            const newData: PhaseCredentials = {
                ...formData,
                startDate: date
            };
            setFormData({...newData});
        }
    }

    const handleEnd = (date: Date) => {
        if(formData) {
            if(date <= formData.startDate) return;
            const newData: PhaseCredentials = {
               ...formData,
               endDate: date
            };
            setFormData({...newData});
        }
    }

    return <FormComponent formLabel="новий етап">
        <div>
            <label>назва</label>
            <input type="text" name="name" onChange={handleChange}/>
        </div>
        <div>
            <label>мета</label>
            <input type="text" name="goal" onChange={handleChange}/>
        </div>
        <div className="flex flex-col gap-1">
                <div className="flex justify-center">Терміни:</div>
                <div className="flex justify-center">
                    <DatePicker className="flex flex-col gap-2" handleStart={handleStart} handleEnd={handleEnd} startDate={formData.startDate} endDate={formData.endDate}/>
                </div>
            </div>
        <button type="button" className={submitButtonStyle} onClick={() => newPhaseHandler(formData)}>
            створити
        </button>
    </FormComponent>
}

export default NewPhaseForm;