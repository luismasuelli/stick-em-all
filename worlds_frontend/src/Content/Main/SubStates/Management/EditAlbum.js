import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useNavigate, useParams} from "react-router-dom";
import React, {Fragment, useContext, useEffect, useState} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import ParamsContext from "../../../Contexts/ParamsContext";
import Section from "../../../Controls/Section";
import {Alert, Button, Grid, MenuItem, Select, Switch, Typography} from "@mui/material";
import {ImagePreview} from "../../../Controls/ImagePreview";
import Heading from "../../../Controls/Heading";
import Label from "../../../Controls/Label";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import StaticText from "../../../Controls/StaticText";
import TokenInput from "../../../Controls/TokenInput";

function usdFromCents(v) {
    v = v.toString();
    switch(v.length) {
        case 0:
            return "$0.00";
        case 1:
            return "$0.0" + v;
        case 2:
            return "$0." + v;
        default:
            return `$${v.substring(0, v.length - 2)}.${v.substring(v.length - 2)}`;
    }
}

function useGlobalContextData() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account, web3} = context;
    const {worldId, albumId} = useParams();
    const {wrappedCall} = useContext(ContractWindowContext);

    return {account, worldId, albumId, wrappedCall, web3};
}

function AlbumData({ worldsManagement, setAlbumData, refreshFlag }) {
    // Global contexts.
    const {wrappedCall, albumId} = useGlobalContextData();

    // Local data.
    const [localAlbumData, setLocalAlbumData] = useState({
        worldId: '', name: '', edition: '', frontImage: '', backImage: '',
        rarityIcons: '', totalStickers: 0, completedPages: 0, released: false
    });

    useEffect(() => {
        console.log("Setting album data...");
        const getAlbumData = wrappedCall(async function() {
            // 1. Download the album data for the given id.
            const {
                worldId, name, edition, frontImage, backImage, rarityIcons,
                totalStickers, completedPages, released
            } = await worldsManagement.methods.albumDefinitions(albumId).call();
            let retrievedAlbumData = {
                worldId, name, edition, frontImage, backImage, rarityIcons,
                totalStickers, completedPages, released
            }
            console.log(">>>>>>>>>> RELEASED:", released);

            // 2. Set the downloaded album's data into the albumsData for the albumId.
            setAlbumData(albumId, retrievedAlbumData);
            setLocalAlbumData(retrievedAlbumData);
        });
        getAlbumData();
    }, [albumId, wrappedCall, worldsManagement, setAlbumData, refreshFlag]);

    return <Section title="Album data" color="primary.light">
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
                <Box sx={{textAlign: 'left', p: 2, paddingLeft: 0}}>
                    {localAlbumData.frontImage
                        ? <ImagePreview url={localAlbumData.frontImage}
                                        aspectRatio="8 / 9" cover={true} style={{maxWidth: "400px"}} />
                        : "none"}
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Label>Back image:</Label>
            </Grid>
            <Grid item xs={8}>
                <StaticText>
                    {localAlbumData.backImage
                        ? <ImagePreview url={localAlbumData.backImage}
                                        aspectRatio="8 / 9" cover={true} style={{maxWidth: "400px"}} />
                        : "none"}
                </StaticText>
            </Grid>
            <Grid item xs={4}>
                <Label>Rarity icons:</Label>
            </Grid>
            <Grid item xs={8}>
                <StaticText>
                    {localAlbumData.rarityIcons
                        ? <ImagePreview url={localAlbumData.rarityIcons}
                                        aspectRatio="4 / 1" cover={true} style={{maxWidth: "100px"}} />
                        : "none"}
                </StaticText>
            </Grid>
        </Grid>
    </Section>;
}

function AlbumPages({ worldsManagement, refreshFlag, setRefreshFlag, isReleased }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();
    const paramsContext = useContext(ParamsContext);
    const achievementTypes = paramsContext.paramsData.achievementTypes;
    const navigate = useNavigate();

    // Local data.
    const [albumPages, setAlbumPages] = useState([]);

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
        const getAlbumPages = wrappedCall(async function() {
            // 1. Download the pages' data.
            // eslint-disable-next-line no-undef
            const count = await worldsManagement.methods.albumPageDefinitionsCount(BigInt(albumId)).call();
            let pages = [];
            for(let index = 0; index < count; index++) {
                let {
                    name, backgroundImage, layout, maxStickers,
                    currentlyDefinedStickers, complete
                    // eslint-disable-next-line no-undef
                } = await worldsManagement.methods.albumPageDefinitions(BigInt(albumId), index).call();
                pages.push({
                    name, backgroundImage, layout, maxStickers,
                    currentlyDefinedStickers, complete
                });
            }

            // 2. Set the downloaded data properly.
            setAlbumPages(pages);
        });
        getAlbumPages();
    }, [albumId, wrappedCall, worldsManagement, setAlbumPages, refreshFlag]);

    return <Section title="Pages" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            <Grid item xs={12} sx={{display: "flex", alignItems: "flex-end"}}>
                <Button size="large" color="primary" variant="contained"
                        onClick={() => setRefreshFlag((refreshFlag + 1) % 2)}>Refresh</Button>
            </Grid>
            {albumPages.map((page, idx) => <Fragment key={idx}>
                <Grid item xs={12}>
                    <Heading>
                        Page #{idx + 1} - {page.name}
                        <Button size="small" color="primary" variant="contained" sx={{marginLeft: 2}}
                                onClick={() => navigate(`/manage/${worldId.toString()}/edit/${albumId.toString()}/${idx + 1}`)}>
                            Visit
                        </Button>
                    </Heading>
                </Grid>
                <Grid item xs={4}><Label>Background:</Label></Grid>
                <Grid item xs={8}>
                    <Box sx={{paddingTop: 2, paddingBottom: 2}}>
                        <ImagePreview url={page.backgroundImage} aspectRatio="8 / 9" cover={true}
                                      style={{maxWidth: "400px"}} />
                    </Box>
                </Grid>
                <Grid item xs={4}><Label>Layout:</Label></Grid>
                <Grid item xs={8}>
                    <Box sx={{paddingTop: 2, paddingBottom: 2}}>
                        <div className={`layout layout-${page.layout}`}/>
                    </Box>
                </Grid>
                <Grid item xs={4}><Label>Stickers:</Label></Grid>
                <Grid item xs={8}>
                    <Box sx={{paddingTop: 2, paddingBottom: 2}}>
                        {page.currentlyDefinedStickers.toString()} (complete: {page.complete ? "Yes" : "No"})
                    </Box>
                </Grid>
            </Fragment>)}
            {!isReleased ? <>
                <Heading>Create new page</Heading>
                <Alert severity="warning" sx={{margin: 1}}>
                    Please take special care while creating a page for the album here. Changes cannot be done later.
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
            </> : null}
        </Grid>
    </Section>;
}

function AlbumAchievements({ worldsManagement, refreshFlag, setRefreshFlag }) {
    // Global contexts.
    const {wrappedCall, albumId} = useGlobalContextData();
    const paramsContext = useContext(ParamsContext);

    // Local data.
    const [albumAchievements, setAlbumAchievements] = useState([]);

    // Collecting the available achievement types.
    const achievementTypes = paramsContext.paramsData.achievementTypes;
    let achievementTypesMap = {}
    achievementTypes.filter(
        (achievementType) => achievementType[2] === 1n
    ).forEach((achievementType) => {
        achievementTypesMap[achievementType[1]] = achievementType[0];
    });
    achievementTypesMap["0x0000000000000000000000000000000000000000000000000000000000000000"] = "(none)";

    useEffect(() => {
        const getAlbumAchievements = wrappedCall(async function() {
            // 1. Download the achievements' data.
            // eslint-disable-next-line no-undef
            const count = await worldsManagement.methods.albumAchievementDefinitionsCount(BigInt(albumId)).call();
            let achievements = [];
            for(let index = 0; index < count; index++) {
                let {
                    type_, displayName, image, data
                    // eslint-disable-next-line no-undef
                } = await worldsManagement.methods.albumAchievementDefinitions(BigInt(albumId), index).call();
                achievements.push({
                    type: type_, displayName, image, data
                });
            }

            // 2. Set the downloaded data properly.
            setAlbumAchievements(achievements);
        });
        getAlbumAchievements();
    }, [albumId, wrappedCall, worldsManagement, setAlbumAchievements, refreshFlag]);

    return <Section title="Achievements" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            <Grid item xs={12}>
                <Typography sx={{p: 2}}>These are all the currently defined album achievements</Typography>
            </Grid>
            {albumAchievements.map((achievement, idx) => <Fragment key={idx}>
                <Grid item xs={12}>
                    <Heading>{achievement.displayName} ({achievementTypesMap[achievement.type] || "Unknown"})</Heading>
                </Grid>
                <Grid item xs={4}>
                    <Label>Image:</Label>
                </Grid>
                <Grid item xs={8}>
                    <ImagePreview aspectRatio="1 / 1" cover={false} url={achievement.image}
                                  style={{maxWidth: "200px"}} />
                </Grid>
                <Grid item xs={4}>
                    <Label>Data:</Label>
                </Grid>
                <Grid item xs={8}>
                    <StaticText>
                        {achievement.data}
                    </StaticText>
                </Grid>
            </Fragment>)}
        </Grid>
    </Section>;
}

function AlbumBoosterPackRule({ worldsManagement, index, rule, refreshFlag, setRefreshFlag }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId} = useGlobalContextData();

    // Local data.
    const [platinumProbs, setPlatinumProbs] = useState(0n);
    const [active, setActive] = useState(false);
    const [fiatPrice, setFiatPrice] = useState(200n);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        setPlatinumProbs(BigInt(rule.platinumProbability));
    }, [rule.platinumProbability]);

    useEffect(() => {
        setActive(rule.active);
    }, [rule.active]);

    useEffect(() => {
        setFiatPrice(rule.fiatPrice);
    }, [rule.fiatPrice]);

    const content = (
        `${rule.bronzeStickersCount.toString()}/${rule.silverStickersCount.toString()}/` +
        `${rule.hasGoldOrPlatinumSticker.toString()}`
    );

    function setConstrainedFiatPrice(fiatPrice) {
        if (fiatPrice < 200n) {
            setFiatPrice(200n);
        } else {
            setFiatPrice(fiatPrice);
        }
    }

    function setConstrainedPlatinumProbs(platinumProbs) {
        if (platinumProbs < 0n) {
            setPlatinumProbs(0n);
        } else if (platinumProbs > 10000n) {
            setPlatinumProbs(10000n)
        } else {
            setPlatinumProbs(platinumProbs);
        }
    }

    const handleChange = (event) => {
        setActive(event.target.checked);
    };

    const updateRule = wrappedCall(async function() {
        await worldsManagement.methods.updateBoosterPackRule(
            worldId, albumId, index, active, fiatPrice, platinumProbs
        );
        setRefreshFlag((refreshFlag + 1) % 2);
    });

    return <>
        <Grid item xs={3}>
            <ImagePreview url={rule.image} cover={false} aspectRatio="2 / 3" />
        </Grid>
        <Grid item xs={9}>
            <Grid container>
                <Grid xs={4}><Label>Name:</Label></Grid>
                <Grid xs={8}><StaticText>{rule.name}</StaticText></Grid>
                <Grid xs={4}><Label>Price:</Label></Grid>
                <Grid xs={8}>
                    <TokenInput unit={2} value={fiatPrice} onChange={setConstrainedFiatPrice} />
                </Grid>
                <Grid xs={4}><Label>Platinum chance per 10000:</Label></Grid>
                <Grid xs={8}>
                    <TokenInput value={platinumProbs} onChange={setConstrainedPlatinumProbs} unit="wei"
                                placeholder="0 to 10000" />
                </Grid>
                <Grid xs={4}><Label>Content:</Label></Grid>
                <Grid xs={8}><StaticText>{content}</StaticText></Grid>
                <Grid xs={4}><Label>Active:</Label></Grid>
                <Grid xs={8} sx={{alignItems: 'center'}}>
                    <Switch
                        checked={rule.active}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Button size="large" color="primary" variant="contained"
                            onClick={updateRule}>Update</Button>
                </Grid>
            </Grid>
        </Grid>
    </>;
}

function NewAlbumBoosterPackRule({ worldsManagement, refreshFlag, setRefreshFlag }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [name, setName] = useState('');
    const [fiatPrice, setFiatPrice] = useState(200n);
    const [image, setImage] = useState('');
    const [bronzeStickers, setBronzeStickers] = useState(0);
    const [silverStickers, setSilverStickers] = useState(0);
    const [hasGoldOrPlatinum, setHasGoldOrPlatinum] = useState(false);
    const [platinumProbs, setPlatinumProbs] = useState(0);
    const [localRefresh, setLocalRefresh] = useState(false);

    function setConstrainedFiatPrice(fiatPrice) {
        if (fiatPrice < 200n) {
            setFiatPrice(200n);
        } else {
            setFiatPrice(fiatPrice);
        }
        setLocalRefresh(!localRefresh);
    }

    function setConstrainedPlatinumProbs(platinumProbs) {
        if (platinumProbs < 0n) {
            setPlatinumProbs(0n);
        } else if (platinumProbs > 10000n) {
            setPlatinumProbs(10000n);
        } else {
            setPlatinumProbs(platinumProbs);
        }
        setLocalRefresh(!localRefresh);
    }

    const createRule = wrappedCall(async function() {
        await worldsManagement.methods.updateBoosterPackRule(
            worldId, albumId, name, image.trim(), fiatPrice, bronzeStickers,
            silverStickers, hasGoldOrPlatinum, platinumProbs
        );
        setRefreshFlag((refreshFlag + 1) % 2);
    });

    return <>
        <Grid item xs={12}>
            <Heading>Create a new Booster Pack rule</Heading>
        </Grid>
        <Grid item xs={3}>
            <Label>Name:</Label>
        </Grid>
        <Grid item xs={9}>
            <TextField variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={3}>
            <Label>Image (URL):</Label>
        </Grid>
        <Grid item xs={9}>
            <TextField variant="outlined" value={image} onChange={(e) => setImage(e.target.value)} />
            <ImagePreview url={image} cover={false} aspectRatio="2 / 3" />
        </Grid>
        <Grid item xs={3}>
            <Label>fiatPrice:</Label>
        </Grid>
        <Grid item xs={9}>
            <TokenInput unit={2} value={fiatPrice} onChange={setConstrainedFiatPrice} />
        </Grid>
        <Grid item xs={3}>
            <Label>Bronze Stickers:</Label>
        </Grid>
        <Grid item xs={9}>
            <TokenInput unit="wei" value={bronzeStickers} onChange={setBronzeStickers} />
        </Grid>
        <Grid item xs={3}>
            <Label>Silver Stickers:</Label>
        </Grid>
        <Grid item xs={9}>
            <TokenInput unit="wei" value={silverStickers} onChange={setSilverStickers} />
        </Grid>
        <Grid item xs={3}>
            <Label>Has Gold/Platinum Sticker:</Label>
        </Grid>
        <Grid item xs={9}>
            <Switch checked={hasGoldOrPlatinum} onChange={(e) => setHasGoldOrPlatinum(e.target.checked)} />
        </Grid>
        <Grid xs={3}><Label>Platinum chance per 10000:</Label></Grid>
        <Grid xs={9}>
            <TokenInput value={platinumProbs} onChange={setConstrainedPlatinumProbs} unit="wei"
                        placeholder="0 to 10000" />
        </Grid>
        <Grid xs={12}>
            <Button size="large" color="primary" variant="contained"
                    onClick={createRule}>Create</Button>
        </Grid>
    </>;
}

function AlbumBoosterPackRules({ worldsManagement, refreshFlag, setRefreshFlag }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);

    useEffect(() => {
        const getAlbumBoosterPackRules = wrappedCall(async function() {
            // 1. Download the achievements' data.
            // eslint-disable-next-line no-undef
            const count = await worldsManagement.methods.albumBoosterPackRulesCount(BigInt(albumId)).call();
            let boosterPackRules = [];
            for(let index = 0; index < count; index++) {
                let {
                    active, fiatPrice, name, image, bronzeStickersCount,
                    silverStickersCount, hasGoldOrPlatinumSticker, platinumProbability
                    // eslint-disable-next-line no-undef
                } = await worldsManagement.methods.albumBoosterPackRules(BigInt(albumId), index).call();
                boosterPackRules.push({
                    active, fiatPrice, name, image, bronzeStickersCount,
                    silverStickersCount, hasGoldOrPlatinumSticker, platinumProbability
                });
            }

            // 2. Set the downloaded data properly.
            setAlbumBoosterPackRules(boosterPackRules);
        });
        getAlbumBoosterPackRules();
    }, [albumId, wrappedCall, worldsManagement, setAlbumBoosterPackRules, refreshFlag]);

    return <Section title="Booster Packs" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            {albumBoosterPackRules.map((rule, idx) =>
                <AlbumBoosterPackRule key={idx} index={idx} rule={rule} worldsManagement={worldsManagement}
                                      refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag} />)}
            <NewAlbumBoosterPackRule worldsManagement={worldsManagement} refreshFlag={refreshFlag}
                                     setRefreshFlag={setRefreshFlag} />
        </Grid>
    </Section>;
}

function AlbumReleasePreview({ worldsManagement, refreshFlag, setRefreshFlag }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account, web3} = useGlobalContextData();
    const paramsContext = useContext(ParamsContext);
    const fiatPrices = paramsContext.paramsData.fiatCosts;
    const params = paramsContext.params;
    const albumDefinitionCost = fiatPrices[params[1].hash] || 0n;
    const albumPageDefinitionCost = fiatPrices[params[2].hash] || 0n;
    const albumAchievementDefinitionCost = fiatPrices[params[3].hash] || 0n;
    const albumStickerDefinitionCost = fiatPrices[params[4].hash] || 0n;

    // Local data.
    const [amounts, setAmounts] = useState({
        pages: 0n, totalStickers: 0n, totalAchievements: 0n, totalFiatCost: 0n, totalNativeCost: 0n
    });

    const [canBeReleased, setCanBeReleased] = useState(false);

    const release = wrappedCall(async function() {
        await worldsManagement.methods.releaseAlbum(worldId, albumId).send({
            value: (amounts.totalNativeCost * 110n / 100n).toString()
        });
        setRefreshFlag((refreshFlag + 1) % 2);
    });

    useEffect(() => {
        const getAlbumAchievements = wrappedCall(async function() {
            // eslint-disable-next-line no-undef
            let canBeReleased = BigInt(await worldsManagement.methods.canBeReleased(worldId, albumId).call());
            // eslint-disable-next-line no-undef
            let albumId_ = BigInt(albumId);
            // eslint-disable-next-line no-undef
            const pages = BigInt(await worldsManagement.methods.albumPageDefinitionsCount(albumId_).call());
            // eslint-disable-next-line no-undef
            const totalStickers = BigInt((await worldsManagement.methods.albumDefinitions(albumId_).call()).totalStickers);
            // eslint-disable-next-line no-undef
            const totalAchievements = BigInt(await worldsManagement.methods.albumAchievementDefinitionsCount(albumId_).call()) - 1n;
            // eslint-disable-next-line no-undef
            const totalFiatCost = BigInt(await worldsManagement.methods.getAlbumReleaseFiatCost(albumId_).call());
            // eslint-disable-next-line no-undef
            const totalNativeCost = BigInt(await worldsManagement.methods.getAlbumReleaseNativeCost(albumId_).call());
            setAmounts({ pages, totalStickers, totalAchievements, totalFiatCost, totalNativeCost });
            setCanBeReleased(canBeReleased);
        });
        getAlbumAchievements();
    }, [worldsManagement, albumId, refreshFlag, wrappedCall, worldId]);

    return <Section title="Release costs" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            <Grid item xs={4}><Label>Album:</Label></Grid>
            <Grid item xs={8}>
                <StaticText>
                    {usdFromCents(albumDefinitionCost)}
                </StaticText>
            </Grid>
            <Grid item xs={4}><Label>Pages:</Label></Grid>
            <Grid item xs={8}>
                <StaticText>
                    {amounts.pages.toString()} x {usdFromCents(albumPageDefinitionCost)} = {usdFromCents(amounts.pages * albumPageDefinitionCost)}
                </StaticText>
            </Grid>
            <Grid item xs={4}><Label>Achievements:</Label></Grid>
            <Grid item xs={8}>
                <StaticText>
                    {amounts.totalAchievements.toString()} x {usdFromCents(albumAchievementDefinitionCost)} = {usdFromCents(amounts.totalAchievements * albumAchievementDefinitionCost)}
                </StaticText>
            </Grid>
            <Grid item xs={4}><Label>Stickers:</Label></Grid>
            <Grid item xs={8}>
                <StaticText>
                    {amounts.totalStickers.toString()} x {usdFromCents(albumStickerDefinitionCost)} = {usdFromCents(amounts.totalStickers * albumStickerDefinitionCost)}
                </StaticText>
            </Grid>
            <Grid item xs={4}><Label>Total:</Label></Grid>
            <Grid item xs={8}>
                <StaticText>
                    {usdFromCents(amounts.totalFiatCost)}
                </StaticText>
            </Grid>
            <Grid item xs={4}><Label>Total (MATIC):</Label></Grid>
            <Grid item xs={8}>
                <StaticText>
                    {web3.utils.fromWei(amounts.totalNativeCost, "ether")}
                </StaticText>
            </Grid>
            <Grid item xs={12}>
                {(canBeReleased) ? (<>
                    <Alert severity="warning" sx={{marginTop: 1, marginBottom: 1}}>
                        Please take special care while releasing the here. Releasing cannot be undone.
                    </Alert>
                    <Button size="large" color="primary" variant="contained"
                            onClick={() => release()}>Release</Button>
                </>) : <Alert severity="error">
                    This album cannot be released yet. Ensure the album has an even number of
                    pages and that each page is completely defined.
                </Alert>}
            </Grid>
        </Grid>
    </Section>;
}

export default function EditAlbum({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId, setAlbumData
}) {
    const {worldId, albumId} = useParams();
    const albumData = albumsDataCache[albumId];

    // A refresh flag.
    const [refreshFlag, setRefreshFlag] = useState(0);

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <AlbumData worldsManagement={worldsManagement} worldId={worldId} albumId={albumId}
                   setAlbumData={setAlbumData} refreshFlag={refreshFlag} />
        <AlbumPages worldsManagement={worldsManagement} worldId={worldId} albumId={albumId}
                    refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag}
                    isReleased={albumData && albumData.released} />
        <AlbumAchievements worldsManagement={worldsManagement} worldId={worldId} albumId={albumId}
                           refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag} />
        {albumData ? (
            albumData.released
                ? <AlbumBoosterPackRules worldsManagement={worldsManagement}
                                         refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag} />
                : <AlbumReleasePreview worldsManagement={worldsManagement}
                                       refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag}/>
        ) : null}
    </AlbumsListEnabledLayout>;
}
