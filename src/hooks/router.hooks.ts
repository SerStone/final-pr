import { useLocation } from "react-router-dom";

interface IState<T> {
    state: T;
    pathname: string;
    search: string;
    hash: string;
}

const useAppLocation = <K>(): IState<K> => {
    const { state, pathname, search, hash } = useLocation();
    return { state, pathname, search, hash };
};

export {
    useAppLocation
};