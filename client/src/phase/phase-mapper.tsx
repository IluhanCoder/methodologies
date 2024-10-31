import { useEffect, useState } from "react";
import { Rights } from "../project/project-types";
import PhaseCard from "./phase-card";
import phaseService from "./phase-service";
import Phase from "./phase-type";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    phases: Phase[],
    rights: Rights,
    projectId: string,
    callBack?: () => Promise<void>
}

const PhasesMapper = ({phases, rights, callBack, projectId}: LocalParams) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const getActiveIndex = async () => {
        const result = await phaseService.getActiveWaterFallIndex(projectId);
        setActiveIndex(result.index);
    }

    useEffect(() => {
        getActiveIndex();
    }, [phases]);

    if(activeIndex !== undefined) return <div>
        {phases.map((phase: Phase, index: number) => <PhaseCard isActive={index == activeIndex || index == activeIndex - 1} callBack={callBack} rights={rights} phase={phase}/>)}
    </div>
    else return <LoadingScreen/>
}

export default PhasesMapper;