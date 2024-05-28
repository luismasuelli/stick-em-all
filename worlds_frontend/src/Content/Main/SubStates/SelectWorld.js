import ThemedBox from "../../Controls/ThemedBox";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";

export default function SelectWorld({ worldsList, worldsData }) {
    return <WorldsListEnabledLayout worldsList={worldsList} worldsData={worldsData}>
        <ThemedBox severity="none" sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: 2, height: "100%"
        }}>
            <p>Select or create a world to continue</p>
        </ThemedBox>
    </WorldsListEnabledLayout>;
}