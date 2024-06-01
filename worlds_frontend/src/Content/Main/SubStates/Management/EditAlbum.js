import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import Section from "../../../Controls/Section";
import {Alert, Button, Grid, MenuItem, Select, Typography} from "@mui/material";
import {ImagePreview} from "../../../Controls/ImagePreview";
import Heading from "../../../Controls/Heading";
import Label from "../../../Controls/Label";
import TextField from "@mui/material/TextField";
import ParamsContext from "../../../Contexts/ParamsContext";

function useGlobalContextData() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {worldId, albumId} = useParams();
    const {wrappedCall} = useContext(ContractWindowContext);

    return {account, worldId, albumId, wrappedCall};
}

function AlbumData({ worldsManagement, setAlbumData }) {
    // Global contexts.
    const {wrappedCall, albumId} = useGlobalContextData();

    // Local data.
    const [localAlbumData, setLocalAlbumData] = useState({
        worldId: '', name: '', edition: '', frontImage: '', backImage: '',
        rarityIcons: '', totalStickers: 0, completedPages: 0, released: false
    });

    useEffect(() => {
        const getAlbumData = wrappedCall(async function getWorldData() {
            // 1. Download the album data for the given id.
            const {
                worldId, name, edition, frontImage, backImage, rarityIcons,
                totalStickers, completedPages, released
            } = await worldsManagement.methods.albumDefinitions(albumId).call();
            let retrievedAlbumData = {
                worldId, name, edition, frontImage, backImage, rarityIcons,
                totalStickers, completedPages, released
            }
            // 2. Set the downloaded world's data into the worldsData for the worldId.
            setAlbumData(albumId, retrievedAlbumData);
            setLocalAlbumData(retrievedAlbumData);
        });
        getAlbumData();
    }, [albumId, wrappedCall, worldsManagement, setAlbumData]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            <Grid item xs={4}>
                <Label>Base data:</Label>
            </Grid>
            <Grid item xs={8}>
                <Label sx={{textAlign: 'left', paddingLeft: 0}}>
                    Name: {localAlbumData.name}<br />
                    Edition: {localAlbumData.edition}<br />
                    Pages: {localAlbumData.completedPages} (completely defined ones)<br />
                    Released: {localAlbumData.released ? "Yes" : "No"}
                </Label>
            </Grid>
            <Grid item xs={4}>
                <Label>Front image:</Label>
            </Grid>
            <Grid item xs={8}>
                <Typography sx={{textAlign: 'left', p: 2, paddingLeft: 0}}>
                    {localAlbumData.frontImage
                        ? <ImagePreview url={localAlbumData.frontImage}
                                        aspectRatio="8 / 9" cover={true} style={{maxWidth: "400px"}} />
                        : "none"}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Label>Back image:</Label>
            </Grid>
            <Grid item xs={8}>
                <Typography sx={{textAlign: 'left', p: 2, paddingLeft: 0}}>
                    {localAlbumData.backImage
                        ? <ImagePreview url={localAlbumData.backImage}
                                        aspectRatio="8 / 9" cover={true} style={{maxWidth: "400px"}} />
                        : "none"}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Label>Rarity icons:</Label>
            </Grid>
            <Grid item xs={8}>
                <Typography sx={{textAlign: 'left', p: 2, paddingLeft: 0}}>
                    {localAlbumData.rarityIcons
                        ? <ImagePreview url={localAlbumData.rarityIcons}
                                        aspectRatio="4 / 1" cover={true} style={{maxWidth: "100px"}} />
                        : "none"}
                </Typography>
            </Grid>
        </Grid>
    </Section>;
}

function AlbumPages({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();
    const paramsContext = useContext(ParamsContext);
    const achievementTypes = paramsContext.paramsData.achievementTypes;
    const navigate = useNavigate();

    // Local data.
    const [albumPages, setAlbumPages] = useState([]);

    // A refresh flag.
    const [refreshFlag, setRefreshFlag] = useState(0);

    const [name, setName] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [layout, setLayout] = useState(0);
    const [achievementType, setAchievementType] = useState('');
    const [achievementName, setAchievementName] = useState('');
    const [achievementImage, setAchievementImage] = useState('');
    const [achievementData, setAchievementData] = useState('');

    // Defining a page
    const defineAlbumPage = wrappedCall(async function() {
        let _achievementData = (achievementData || "").trim().toLowerCase() || "0x0000000000000000000000000000000000000000000000000000000000000000";
        if (!/^0x[a-f0-9]{64}$/.test(_achievementData)) {
            throw new Error("The achievement data must be blank or a 0x-prefixed string + 64 hexadecimal chars");
        }

        const tx = await worldsManagement.methods.defineAlbumPage(
            worldId, albumId, name, backgroundImage, layout,
            achievementType, achievementName, achievementImage, _achievementData
        ).send({from: account});

        setRefreshFlag((refreshFlag + 1) % 2);
    });

    useEffect(() => {
        const getAlbumData = wrappedCall(async function getWorldData() {
            // 1. Download the pages' data.
            // 2. Set the downloaded world's data into the worldsData for the worldId.
            setAlbumPages([]);
        });
        getAlbumData();
    }, [albumId, wrappedCall, worldsManagement, setAlbumPages, refreshFlag]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            <Grid item xs={12} sx={{display: "flex", alignItems: "flex-end"}}>
                <Button size="large" color="primary" variant="contained"
                        onClick={() => setRefreshFlag((refreshFlag + 1) % 2)}>Refresh</Button>
            </Grid>
            {albumPages.map((page, idx) => <>
                <Grid item xs={12}>
                    <Heading>
                        Page #{idx + 1} - {page.name}
                        <Button size="small" color="primary" variant="contained"
                                onClick={() => navigate(`/manage/${worldId.toString()}/edit/${albumId.toString()}/${idx + 1}`)}>
                            Visit
                        </Button>
                    </Heading>
                </Grid>
                <Grid item xs={4}><Label>Background:</Label></Grid>
                <Grid item xs={8}>
                    <ImagePreview url={page.backgroundImage} aspectRatio="8 / 9" cover={true}
                                  style={{maxWidth: "400px"}} />
                </Grid>
                <Grid item xs={4}><Label>Layout:</Label></Grid>
                <Grid item xs={8}>
                    <div className={`layout layout-${page.layout}`} />
                </Grid>
                <Grid item xs={4}><Label>Stickers:</Label></Grid>
                <Grid item xs={8}>
                    {page.currentlyDefinedStickers} (complete: {page.complete ? "Yes" : "No"})
                </Grid>
            </>)}
            <Heading>Create new page</Heading>
            <Alert severity="warning" sx={{margin: 1}}>
                Please take special care while creating the bare album here. Changes cannot be done later.
                Stickers (and THEIR achievements) will be added later.
            </Alert>
            <Grid container>
                <Grid item xs={4}><Label>Name:</Label></Grid>
                <Grid item xs={8}>
                    <TextField variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item xs={4}><Label>Background:</Label></Grid>
                <Grid item xs={8}>
                    <TextField variant="outlined" value={backgroundImage} onChange={(e) => setBackgroundImage(e.target.value)} />
                    <ImagePreview aspectRatio="8 / 9" cover={true} url={backgroundImage} style={{maxWidth: "400px"}} />
                </Grid>
                <Grid item xs={4}><Label>Layout:</Label></Grid>
                <Grid item xs={8}>
                    <Select autoWidth label="Layout" sx={{ minWidth: 100, bgcolor: 'background.paper', marginRight: '10px', padding: '5px' }}
                            value={layout} onChange={(e) => setLayout(e.target.value)}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
                            (layoutIndex, index) => (
                                <MenuItem value={layoutIndex} key={index}>
                                    <div className={`layout layout-${layoutIndex}`} />
                                </MenuItem>
                            )
                        )}
                    </Select>
                </Grid>
                <Grid item xs={4}><Label>Achievement Type:</Label></Grid>
                <Grid item xs={8}>
                    <Select autoWidth label="Achievement Type" sx={{ minWidth: 100, bgcolor: 'background.paper', marginRight: '10px', padding: '5px' }}
                            value={achievementType} onChange={(e) => setAchievementType(e.target.value)}>
                        <MenuItem value="0x0000000000000000000000000000000000000000000000000000000000000000">
                            <i>None</i>
                        </MenuItem>
                        {achievementTypes.filter(
                            (achievementType) => achievementType[2] === 1n
                        ).map(
                            (achievementType, index) => (
                                <MenuItem value={achievementType[1]} key={index}>{achievementType[0]}</MenuItem>
                            )
                        )}
                    </Select>
                </Grid>
                <Grid item xs={4}><Label>Achievement Name:</Label></Grid>
                <Grid item xs={8}>
                    <TextField variant="outlined" value={achievementName} onChange={(e) => setAchievementName(e.target.value)} />
                </Grid>
                <Grid item xs={4}><Label>Achievement Image (URL):</Label></Grid>
                <Grid item xs={8}>
                    <TextField variant="outlined" value={achievementImage} onChange={(e) => setAchievementImage(e.target.value)} />
                    <ImagePreview aspectRatio="1 / 1" cover={true} url={achievementImage} style={{maxWidth: "400px"}} />
                </Grid>
                <Grid item xs={4}><Label>Achievement Data:</Label></Grid>
                <Grid item xs={8}>
                    <TextField variant="outlined" placeholder="Optional, 0x + 64 hex. chars" value={achievementData}
                               onChange={(e) => setAchievementData(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" size="large"
                            onClick={() => defineAlbumPage()}>
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    </Section>;
}

function AlbumAchievements({worldsManagement}) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumAchievements, setAlbumAchievements] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

function AlbumBoosterPackRules({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

function AlbumReleasePreview({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

export default function EditAlbum({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId, setAlbumData
}) {
    const {worldId, albumId} = useParams();
    const albumData = albumsDataCache[albumId];

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <AlbumData worldsManagement={worldsManagement} worldId={worldId} albumId={albumId}
                   setAlbumData={setAlbumData} />
        <AlbumPages worldsManagement={worldsManagement} worldId={worldId} albumId={albumId} />
        <AlbumAchievements worldsManagement={worldsManagement} worldId={worldId} albumId={albumId} />
        {albumData ? (
            albumData.released
                ? <AlbumBoosterPackRules worldsManagement={worldsManagement} />
                : <AlbumReleasePreview worldsManagement={worldsManagement} />
        ) : null}
    </AlbumsListEnabledLayout>;
}
