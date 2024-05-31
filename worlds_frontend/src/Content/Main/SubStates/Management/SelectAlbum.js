import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import ThemedBox from "../../../Controls/ThemedBox";

export default function SelectAlbum({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId
}) {
    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance} backToEdit={true}>
        <ThemedBox severity="none" sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: 2, height: "100%"
        }}>
            <p>Select or create an album to continue</p>
        </ThemedBox>
    </AlbumsListEnabledLayout>;
}