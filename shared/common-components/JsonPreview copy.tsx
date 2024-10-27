import React, { useState } from 'react';
import ReactJson from 'react-json-view';

const JsonPreview = ({ data }) => {
    const [showJson, setShowJson] = useState(false);

    return (
        <div style={{ backgroundColor: '#f4f4f4', padding: '10px', margin: '20px auto' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                <input
                    type="checkbox"
                    checked={showJson}
                    onChange={() => setShowJson(!showJson)}
                    style={{ marginRight: '8px' }}
                />
                {showJson ? 'Hide legacy information' : 'Show legacy information'}
            </label>
            {showJson && (
                <div style={{ marginTop: '10px' }}>
                    <ReactJson src={data} theme="monokai" collapsed={false} enableClipboard={true} />
                </div>
            )}
        </div>
    );
};

export default JsonPreview;
