import ThemedPaper from "../../Controls/ThemedPaper";
import {Box, Button} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Label from "../../Controls/Label";
import {useContext, useEffect, useMemo, useState} from "react";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import {useNonReactive} from "../../../Utils/nonReactive";


function AlbumPage({
    albumId, albumTypeId, pageDefinition
}) {
    const layout = pageDefinition.layout;
    const background = pageDefinition.backgroundImage ? `url("${pageDefinition.backgroundImage}")` : "none";

    return <Box style={{width: "100%", height: "100%", backgroundImage: background}}>

    </Box>
}


function AlbumLayout({
    worldsManagement, wrappedCall, albumId, albumTypeId, albumDataCache
}) {
    const {
        completedPages, frontImage, backImage
    } = albumDataCache;
    wrappedCall = useNonReactive(wrappedCall);

    // 1. Retrieve the pages from the albumTypeId (albumPageDefinitions).
    const [pages, setPages] = useState([]);
    useEffect(() => {
        const getPages = wrappedCall(async function() {
            const count = await worldsManagement.methods.albumPageDefinitionsCount(albumTypeId).call();

            const newPages = [];
            for(let idx = 0; idx < count; idx++) {
                let {
                    name, backgroundImage, layout, maxStickers,
                    currentlyDefinedStickers, complete
                    // eslint-disable-next-line no-undef
                } = await worldsManagement.methods.albumPageDefinitions(BigInt(albumTypeId), idx).call();
                newPages.push({
                    name, backgroundImage, layout, maxStickers,
                    currentlyDefinedStickers, complete
                });
            }
            setPages(newPages);
        });
        getPages();
    }, [worldsManagement, albumTypeId, wrappedCall]);
    const maxPages = useMemo(() => pages.length/2 + 2, [pages]);

    // 2. Tell which one is the current page.
    const [currentPage, setCurrentPage] = useState(0);

    return <Box sx={{
        marginTop: 2, marginBottom: 2, width: "100%", aspectRatio: "16 / 9",
        display: "flex"
    }}>
        <Box sx={{height: "100%", width: "50%", position: "relative"}}>
            {(currentPage === 0)
                ? <></>
                : (currentPage === maxPages - 1)
                    ? <img src={backImage} style={{width: "100%", height: "100%"}} alt="" />
                    : <AlbumPage albumId={albumId} pageDefinition={pages[(currentPage - 1) * 2]} />
            }
            <Button style={{position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)"}}
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    variant="contained" color="primary" size="large">&#9664; Prev</Button>
        </Box>
        <Box sx={{height: "100%", width: "50%", position: "relative"}}>
            {(currentPage === 0)
                ? <img src={frontImage} style={{width: "100%", height: "100%"}} alt="" />
                : (currentPage === maxPages - 1)
                    ? <></>
                    : <AlbumPage albumId={albumId} pageDefinition={pages[currentPage * 2 - 1]} />
            }
            <Button style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)"}}
                    onClick={() => setCurrentPage(Math.min(maxPages - 1, currentPage + 1))}
                    variant="contained" color="primary" size="large">Next &#9654;</Button>
        </Box>
    </Box>
}

export default function Album({
    worldsManagement, worlds, economy,
    albumsDataCache, assetsDataCache, albumTypesDataCache
}) {
    const {wrappedCall} = useContext(ContractWindowContext);
    const navigate = useNavigate();
    const {albumId} = useParams();
    const albumTypeId = albumTypesDataCache[albumId];
    const albumDataCache = albumsDataCache[albumTypeId];

    return <ThemedPaper sx={{minHeight: "600px", marginTop: 2}}>
        <Box sx={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 1, marginTop: 1
        }}>
            <Button variant="contained" color="primary"
                    onClick={() => navigate("/")}>&#9664; Back</Button>
            <Label sx={{paddingRight: 0}}>
                You're in an album: {albumDataCache?.name || "(Unknown)"}&nbsp;
                (Edition: {albumDataCache?.edition || "(Unknown)"})
            </Label>
        </Box>
        <Box>
            {(albumDataCache) ? (
                <AlbumLayout worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                             albumId={albumId} albumTypeId={albumTypeId}
                             albumDataCache={albumDataCache} />
            ) : null}
        </Box>
    </ThemedPaper>;
}