import BacklogMapper from "../backlogs/backlogs-mapper";
import LoadingScreen from "../misc/loading-screen";
import projectService from "../project/project-service";
import { ExtendedProjectResponse, ProjectResponse, Rights } from "../project/project-types"
import { submitButtonStyle } from "../styles/button-syles";


interface LocalParams {
    project: ExtendedProjectResponse,
    rights: Rights,
    onCreate: () => void
}

const Scrum = ({project, rights, onCreate}: LocalParams) => {
    if(project) return <div className="flex flex-col gap-2">
        <div className="font-bold">Беклоги:</div>
        {project && rights && <div>
            <BacklogMapper rights={rights} projectId={project._id}/>
        </div>}                        
        {rights?.create && <div className="flex justify-center">
            <button onClick={onCreate} className={submitButtonStyle + " text-base"}>створити беклог</button>
        </div>}
    </div>
    else return <LoadingScreen/>

}

export default Scrum;