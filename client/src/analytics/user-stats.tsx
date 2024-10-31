import { useEffect, useState } from "react";
import { convertArray } from "./analytics-helper";
import AnalyticsGraph from "./graph";
import analyticsService from "./analytics-service";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    userId: string
}

const UserStats = ({userId}: LocalParams) => {
    const [doneTasksData, setDoneTasksData] = useState<any[]>();
    const [loginStatsData, setLoginStatsData] = useState<any[]>();

    const getData = async () => {
        const doneTasksStats = await analyticsService.getDoneTasksStatistics(userId);
        const loginStats = await analyticsService.getLoginStatistics(userId);

        setDoneTasksData([...doneTasksStats.data]);
        setLoginStatsData([...loginStats.data]);
    }

    useEffect(() => {
        getData()
    }, []);

    return <div>
        {doneTasksData && <div className="flex justify-center mt-2">
            <div className="flex flex-col gap-2">
                <div className="text-2xl flex justify-center">Виконання завдань</div>
                <AnalyticsGraph data={convertArray(doneTasksData)} name="кількість"/>
            </div>
        </div> || <LoadingScreen/>}
        {loginStatsData && <div className="flex justify-center mt-2">
            <div className="flex flex-col gap-2">
                <div className="text-2xl flex justify-center">Вхід в систему</div>
                <AnalyticsGraph data={convertArray(loginStatsData)} name="кількість"/>
            </div>
        </div> || <LoadingScreen/>}
    </div>
}

export default UserStats;