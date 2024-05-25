import {useNavigate} from 'react-router-dom';


/**
 * Renders the list of worlds, which involves two things:
 * 1. The cached data for each world.
 * 2. The list of worlds.
 * @param worldsList The list of worlds.
 * @param worldsData The cached data. Some worlds do not have cached
 * data for them. This is until they're visited.
 */
export default function WorldsList({ worldsList, worldsData }) {
    const navigate = useNavigate();
    return <>
    </>;
}