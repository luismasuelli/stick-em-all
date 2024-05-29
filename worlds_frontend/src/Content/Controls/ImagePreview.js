import {useEffect, useState} from "react";
import {useNonReactive} from "../../Utils/nonReactive";


export function ImagePreview({
    url, aspectRatio = "auto", delay = 3000,
    alt = "Preview", style = {}, cover = false,
    width = "100%", ...props
}) {
    let [delayedUrl, setDelayedUrl_] = useState("");
    const setDelayedUrl = useNonReactive(setDelayedUrl_);
    style = {
        display: "block",
        ...(style || {}), width, aspectRatio,
        objectFit: cover ? "cover" : "contain"
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            timer = 0;
            setDelayedUrl((url || "").toString().trim());
        }, Math.max(0, delay));

        return () => {
            if (timer) clearTimeout(timer);
        }
    }, [url, delay, setDelayedUrl]);

    return !delayedUrl ? <></> : <img src={delayedUrl} style={style} alt={alt} {...props} />;
}