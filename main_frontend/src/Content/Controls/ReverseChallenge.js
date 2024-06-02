import {useEffect, useState} from "react";
import {useNonReactive} from "../../Utils/nonReactive";
import {Alert} from "@mui/material";


export function ReverseChallenge({
    worldId, validatorUrl, externalUrl, delay = 3000
}) {
    let [delayedValidatorUrl, setDelayedValidatorUrl_] = useState("");
    let [validationStatus, setValidationStatus_] = useState("none");
    const setDelayedValidatorUrl = useNonReactive(setDelayedValidatorUrl_);
    const setValidationStatus = useNonReactive(setValidationStatus_);

    useEffect(() => {
        let timer = setTimeout(() => {
            timer = 0;
            setDelayedValidatorUrl((validatorUrl || "").toString().trim());
        }, Math.max(0, delay));

        return () => {
            if (timer) clearTimeout(timer);
        }
    }, [validatorUrl, delay, setDelayedValidatorUrl]);

    useEffect(() => {
        // No validator url means no challenge.
        if (!delayedValidatorUrl) {
            setValidationStatus("none");
            return;
        }

        // Test for mismatching external url.
        const externalUrl_ = externalUrl.replace(/[/]*$/, "") + "/";
        console.log(externalUrl_, "vs", delayedValidatorUrl);
        if (!delayedValidatorUrl.startsWith(externalUrl_)) {
            setValidationStatus("error:external-url");
            return;
        }

        // Test for validator url against the world.
        (async function() {
            try {
                const headers = new Headers();
                headers.append("pragma", "no-cache");
                headers.append("cache-control", "no-cache");
                const response = await fetch(delayedValidatorUrl, {
                    method: 'GET',
                    headers: new Headers(),
                });
                if (!response.ok) {
                    setValidationStatus("error:fetch");
                }
                const obj = await response.json();
                console.log(obj);
                const testWorldId = (obj["world-id"] || "").toString();
                const dec = worldId.toString();
                const hex = worldId.toString(16);
                console.log(testWorldId, dec, hex);
                if (testWorldId !== dec && testWorldId !== hex && testWorldId !== "0x" + hex) {
                    setValidationStatus("error:mismatch");
                } else {
                    setValidationStatus("success");
                }
            } catch(e) {
                console.error(e);
                setValidationStatus("error:unknown");
            }
        })();
    }, [delayedValidatorUrl, externalUrl, setValidationStatus, worldId]);

    switch(validationStatus) {
        case "none":
            return <Alert severity="warning">
                No validation URL is set.
            </Alert>
        case "error:external-url":
            return <Alert severity="error">
                External URL mismatch while validating.
            </Alert>
        case "error:fetch":
            return <Alert severity="error">
                Fetch error while validating.
            </Alert>
        case "error:mismatch":
            return <Alert severity="error">
                Validation failed.
            </Alert>
        case "success":
            return <Alert severity="success">
                Validated.
            </Alert>
        default:
            return <Alert severity="error">
                Unknown error while validating.
            </Alert>
    }
}