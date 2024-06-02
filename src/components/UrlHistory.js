import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function URLHistory({history, onClearHistory}) {

    const formatData = (dateString) => {
        const date = new Date(dateString);
        const fDate = date.toLocaleDateString();
        const fTime = date.toLocaleTimeString();
        return `${fDate} ${fTime}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleClearHistory = () => {
        if(history.length > 0) {
            onClearHistory();
            toast.warn('URL history cleared!');
        }
    };

    return (
        <div className='url-history'>
            <h2>URL History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Original URL</th>
                        <th>Shortened URL</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(({originalUrl, shortUrl, createdAt}, index) => (
                        <tr key={index}>
                            <td>{originalUrl}</td>
                            <td>{shortUrl}</td>
                            <td>{formatData(createdAt)}</td>
                            <td>
                                <button
                                    onClick={() => copyToClipboard(shortUrl)}
                                >
                                    Copy
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <button onClick={handleClearHistory}>Clear History</button>

                <ToastContainer/>
            </table>
        </div>
    )
}

export default URLHistory;