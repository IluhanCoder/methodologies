import { ChangeEvent, FormEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import { TaskCredentials } from "./task-types";
import userStore from "../user/user-store";
import taskService from "./task-service";
import formStore from "../forms/form-store";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    backlogId?: string,
    projectId?: string,
    sprintId?: string,
    phaseId?: string,
    callBack?: () => void
}

function NewTaskForm({backlogId, projectId, sprintId, phaseId, callBack}: LocalParams) {
    const [formData, setFormData] = useState<TaskCredentials>({
        backlogId: backlogId ?? null,
        projectId: projectId ?? null,
        sprintId: sprintId ?? null,
        phaseId: phaseId ?? null,
        name: "",
        desc: "",
        requirements: "",
        createdBy: userStore.user?._id ?? ""
    });

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        await taskService.newTask(formData);
        if(callBack) callBack();
        formStore.dropForm();
    }

    const handleChange = (event: any) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }; 



    return <FormComponent formLabel="Нова Задача">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-4">
            <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col gap-2 px-2">
                    <label className="font-bold text-gray-600 text-xs">назва</label>
                    <input type="text" className={inputStyle + " w-96"} name="name" onChange={handleChange}></input>
                </div>
                <div className="flex flex-col gap-2 px-2">
                    <label className="font-bold text-gray-600 text-xs">опис</label>
                    <textarea className={inputStyle} name="desc" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2 px-2">
                    <label className="font-bold text-gray-600 text-xs">вимоги</label>
                    <textarea className={inputStyle} name="requirements" onChange={handleChange}/>
                </div>
            </div>
            <div className="flex justify-center">
                <button className={submitButtonStyle} type="submit">створити</button>
            </div>
        </form>
    </FormComponent>
}

export default NewTaskForm;