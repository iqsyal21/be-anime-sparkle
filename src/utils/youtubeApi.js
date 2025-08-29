import fetch from "node-fetch";

export const fetchAllPlaylists = async (channelId, apiKey) => {
    let results = [];
    let nextPageToken = "";

    do {
        const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
        const resp = await fetch(url);
        const data = await resp.json();

        results = results.concat(data.items || []);
        nextPageToken = data.nextPageToken || "";
    } while (nextPageToken);

    return { items: results };
};
