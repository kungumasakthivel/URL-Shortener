import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputForm from './InputForm';
import ShortenedUrl from './ShortenedUrl';
import URLHistory from './UrlHistory';
import { InfinitySpin } from 'react-loader-spinner'

function Shortener() {

    const [shortUrl, setShortUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [urlHistory, setUrlHistory] = useState([]);
    const [loder, setLoder] = useState(false);

    useEffect(() => {
        const storedHistory = localStorage.getItem('urlHistory');
        if(storedHistory) {
            setUrlHistory(JSON.parse(storedHistory));
        }
    }, []);

    const handleClearHistory = () => {
        setUrlHistory([]);
        localStorage.removeItem('urlHistory');
    }

    const handleSubmit = async (url) => {
        const accessToken = `c5eeb44c39d84b9bbc5acff35b3361a3dde40abf`;
        const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';

        const formatedUrl = /^(https?|ftp):\/\//i.test(url) ? url : `http://${url}`;

        const fetchShorterURL = async() => {
            setLoder(true);
            const response = await axios.post(
                apiUrl,
                { long_url: formatedUrl },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setLoder(false);
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
        };

        try {
            fetchShorterURL();
        } catch (e) {
            console.error(e);
        }
    };

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
            {loder && 
                <InfinitySpin
                    visible={true}
                    width="100"
                    color="#4fa94d"
                    ariaLabel="infinity-spin-loading"
                />}
            {urlHistory.length > 0 && <URLHistory history={urlHistory} onClearHistory={handleClearHistory} />}
        </div>
    )
}

export default Shortener;