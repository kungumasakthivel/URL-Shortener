import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputForm from './InputForm';
import ShortenedUrl from './ShortenedUrl';

function Shortener() {

    const [shortUrl, setShortUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [urlHistory, setUrlHistory] = useState([]);

    const handleSubmit = async (url) => {
        const accessToken = `access_token`;
        const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';

        const formatedUrl = /^(https?|ftp):\/\//i.test(url) ? url: `http://${url}`;
        try {
            const response = await axios.post(
                apiUrl,
                {long_url: formatedUrl},
                {
                    headers: {
                        Authorization: `Bearer  + ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            const shortenedUrl = response.data.link;
            setShortUrl(shortenedUrl);

            const historyItem = {
                originalUrl: url,
                shortUrl: shortenedUrl,
                createdAt: new Date().toISOString(),
            };

            const updatedHistory = [historyItem, ...urlHistory];
            setUrlHistory(updatedHistory);
            localStorage.setItem('urlHistory', JSON.stringify(updatedHistory));
        } catch(e) {
            console.error(e);
        };
    }

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <div className="shortener-container">
            <h1>URL Shortener</h1>
            <InputForm onSubmit={handleSubmit} />
            {shortUrl && <ShortenedUrl url={shortUrl} onCopy={handleCopy} />}
            {copied && <p className="copy-message">URL copied to clipboard!</p>}
        </div>
    )
}

export default Shortener;