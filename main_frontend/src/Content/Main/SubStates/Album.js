import ThemedPaper from "../../Controls/ThemedPaper";
import {Box, Button} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Label from "../../Controls/Label";
import {useContext, useEffect, useMemo, useState} from "react";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import {useNonReactive} from "../../../Utils/nonReactive";


function AlbumPastedSticker({
    worldsManagement, albumTypeId, pageIdx, slotIdx, pasted, albumDataCache,
    wrappedCall, left, top
}) {
    console.log("Printing sticker...");

    const {
        rarityIcons
    } = albumDataCache;

    const [stickerData, setStickerData] = useState({
        displayName: "", image: "", rarity: 0
    });

    useEffect(() => {
        const getStickerDefinition = wrappedCall(async function() {
            const {
                displayName, image, rarity
            } = await worldsManagement.methods.albumPageStickersDefinitions(
                albumTypeId, pageIdx, slotIdx
            ).call();
            setStickerData({
                displayName, image, rarity
            });
        });
        getStickerDefinition();
    }, [albumTypeId, pageIdx, slotIdx, wrappedCall, worldsManagement]);

    // eslint-disable-next-line no-undef
    const rarityIndex = parseFloat(stickerData.rarity.toString());
    const rarityIconsUrl = rarityIcons ? `url("${rarityIcons}")` : "none";
    const imageUrl = stickerData.image ? `url("${stickerData.image}")` : "none";

    return <Box style={{
        width: "20%", aspectRatio: "1 / 1", position: "absolute", left: left || 0, top: top || 0,
        transform: "translate(-50%, -50%)", opacity: pasted ? 1 : 0.5,
        backgroundImage: imageUrl, backgroundSize: "contain"
    }}>
        <Box style={{
            width: "20%", height: "20%", position: "absolute", bottom: "10%", right: "10%",
            backgroundImage: rarityIconsUrl, backgroundRepeat: "no-repeat", backgroundSize: "400% 100%",
            backgroundPosition: `${(rarityIndex * 33.3333333333).toString()}% 0`, zIndex: 1000
        }} />
        <Box style={{
            position: "absolute", bottom: -4, right: -4, top: -4, left: -4,
            width: "100%", height: "100%", zIndex: 2000, border: "4px solid white",
        }} />
    </Box>;
}


function AlbumPage({
    worldsManagement, wrappedCall, albumId, albumTypeId, pageIdx, pageDefinition, albumDataCache
}) {
    const { layout, maxStickers } = pageDefinition;
    const background = pageDefinition.backgroundImage ? `url("${pageDefinition.backgroundImage}")` : "none";

    let content;

    console.log("Layout:", layout);

    switch(layout) {
        case 0n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 1n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 2n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 3n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 4n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 5n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 6n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 7n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 8n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 9n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 10n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 11n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 12n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 13n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 14n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={4}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 15n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={4}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 16n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={4}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        case 17n:
            content = <>
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={0}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={1}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={2}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={3}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={4}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
                <AlbumPastedSticker worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                    albumTypeId={albumTypeId} pageIdx={pageIdx} slotIdx={5}
                                    albumDataCache={albumDataCache} pasted={false} left="50%" top="50%" />
            </>;
            break;
        default:
            content = <></>;
            break;
    }

    return <Box style={{width: "100%", height: "100%", backgroundImage: background}}>
        {content}
    </Box>;
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
                    : <AlbumPage worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                 albumId={albumId}
                                 albumTypeId={albumTypeId} albumDataCache={albumDataCache}
                                 pageIdx={(currentPage - 1) * 2} pageDefinition={pages[(currentPage - 1) * 2]} />
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
                    : <AlbumPage worldsManagement={worldsManagement} wrappedCall={wrappedCall}
                                 albumId={albumId}
                                 albumTypeId={albumTypeId} albumDataCache={albumDataCache}
                                 pageIdx={currentPage * 2 - 1} pageDefinition={pages[currentPage * 2 - 1]} />
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