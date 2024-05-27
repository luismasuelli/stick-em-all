import ThemedBox from "../../Controls/ThemedBox";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";

export default function SelectWorld({ worldsList, worldsData }) {
    return <WorldsListEnabledLayout sx={{minHeight: "600px"}} worldsList={worldsList} worldsData={worldsData}>
        <ThemedBox severity="none" sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', width: '100%', padding: 2
        }}>
            <p>Select or create a world to continue</p>
        </ThemedBox>
    </WorldsListEnabledLayout>;
}