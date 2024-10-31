import { useEffect, useState } from "react";
import LoadingScreen from "../misc/loading-screen";
import projectService from "./project-service";

interface LocalParams {
    projectId: string
}

const PriceWindow = ({projectId}: LocalParams) => {
    const [price, setPrice] = useState<number>();

    const getPrice = async () => {
        const result = await projectService.calculatePrice(projectId);
        setPrice(result.price);
    }

    useEffect(() => {
        getPrice()
    }, []);

    if(price !== undefined) return <div className="flex w-full justify-center gap-2 text-xl p-3 text-stone-700">
        <div>Вартість проєкту:</div>
        <div>{price} $</div>
    </div>
    else return <LoadingScreen/>
}

export default PriceWindow;