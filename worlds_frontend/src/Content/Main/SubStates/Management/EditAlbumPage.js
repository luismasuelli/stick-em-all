import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import {Alert, Button, Grid, MenuItem, Select, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Section from "../../../Controls/Section";
import Heading from "../../../Controls/Heading";
import Label from "../../../Controls/Label";
import {ImagePreview} from "../../../Controls/ImagePreview";
import TextField from "@mui/material/TextField";
import ParamsContext from "../../../Contexts/ParamsContext";

export default function EditAlbumPage({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId
}) {
    const {worldId, albumId, pageId} = useParams();
    const {wrappedCall} = useContext(ContractWindowContext);
    const paramsContext = useContext(ParamsContext);
    const achievementTypes = paramsContext.paramsData.achievementTypes;
    const navigate = useNavigate();

    const albumData = albumsDataCache[albumId];
    const worldData = worldsData[worldId];
    const url = `/manage/${worldId.toString()}/edit/${albumId.toString()}`;

    const [stickers, setStickers] = useState([]);
    const [maxStickers, setMaxStickers] = useState(0);
    const rarities = ["Bronze", "Silver", "Gold", "Platinum"];

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [rarity, setRarity] = useState(0);
    const [achievementType, setAchievementType] = useState('');
    const [achievementData, setAchievementData] = useState('');

    const [refreshFlag, setRefreshFlag] = useState(0);

    useEffect(() => {
        const getPageStickers = wrappedCall(async function() {
            // 1. Download the stickers for the given album id and page id.
            const maxStickers = (await worldsManagement.methods.albumPageDefinitions(albumId, pageId).call()).maxStickers;
            const count = await worldsManagement.methods.albumPageStickersDefinitionsCount(albumId, pageId).call();
            let stickers = [];
            for(let index = 0; index < count; index++) {
                const {
                    displayName, image, rarity
                } = await worldsManagement.methods.albumPageStickersDefinitions(albumId, pageId, index).call();
                stickers.push({ displayName, image, rarity });
            }

            setStickers(stickers);
            setMaxStickers(maxStickers);
        });
        getPageStickers();
    }, [albumId, wrappedCall, pageId, worldsManagement, refreshFlag]);

    const defineSticker = wrappedCall(async function() {
        let _achievementData = (achievementData || "").trim().toLowerCase() || "0x0000000000000000000000000000000000000000000000000000000000000000";
        await worldsManagement.methods.defineAlbumPageSticker(
            worldId, albumId, pageId, name, image, rarity, achievementType, _achievementData
        ).send();
        setRefreshFlag((refreshFlag + 1) % 2);
    });

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <Button variant="contained" color="primary"
                    onClick={() => navigate(url)}>&#9664; Back</Button>
            <Typography sx={{p: 2, textAlign: 'right'}}>
                You're managing the album {albumId.toString()} - {albumData.name} for the world {worldId.toString()} - {worldData.name}
            </Typography>
        </Box>
        <Section title="Page stickers" color="primary.light">
            <Grid container>
                {stickers.map((sticker, index) => <Fragment key={index}>
                    <Grid item xs={12}>
                        <Heading>Sticker #{index + 1} / {maxStickers.toString()}</Heading>
                    </Grid>
                    <Grid item xs={3}>
                        <Label>Name:</Label>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography sx={{marginTop: 2, marginBottom: 2}}>{sticker.displayName}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Label>Image:</Label>
                    </Grid>
                    <Grid item xs={9}>
                        <ImagePreview cover={false} url={sticker.image} aspectRatio="1 / 1"
                                      style={{maxWidth: "400px"}} />
                    </Grid>
                    <Grid item xs={3}>
                        <Label>Rarity:</Label>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography sx={{marginTop: 2, marginBottom: 2}}>{rarities[sticker.rarity]}</Typography>
                    </Grid>
                </Fragment>)}
            </Grid>
            {(maxStickers.toString() === stickers.length.toString()) ? (
                <Alert sx={{marginTop: 1, marginBottom: 1}} severity="success">
                    This page is completed. No more stickers can be defined.
                </Alert>
            ) : (
                <>
                    <Alert sx={{marginTop: 1}} severity="error">
                        This page is not completed yet. More stickers must be defined.
                    </Alert>
                    <Alert severity="warning" sx={{marginBottom: 1}}>
                        Please take special care while creating the stickers here. Changes cannot be done later.
                    </Alert>
                    <Grid container>
                        <Grid item xs={4}>
                            <Label>Name:</Label>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid item xs={4}>
                            <Label>Image:</Label>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" value={image} onChange={(e) => setImage(e.target.value)} />
                            <ImagePreview aspectRatio="1 / 1" cover={false} url={image} style={{maxWidth: "400px"}} />
                        </Grid>
                        <Grid item xs={4}>
                            <Label>Rarity:</Label>
                        </Grid>
                        <Grid item xs={8}>
                            <Select autoWidth label="Rarity" sx={{ minWidth: 100, bgcolor: 'background.paper', marginRight: '10px', padding: '5px' }}
                                    value={rarity} onChange={(e) => setRarity(e.target.value)}>
                                {rarities.map((rarity, index) => {
                                    return <MenuItem value={index} key={index}>{rarity}</MenuItem>;
                                })}
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
                        <Grid item xs={4}><Label>Achievement Data:</Label></Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" placeholder="Optional, 0x + 64 hex. chars" value={achievementData}
                                       onChange={(e) => setAchievementData(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" size="large"
                                    onClick={() => defineSticker()}>
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </Section>
    </AlbumsListEnabledLayout>;
}
