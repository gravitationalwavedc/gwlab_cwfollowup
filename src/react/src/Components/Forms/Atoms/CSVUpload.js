import React, { useState, useRef } from 'react';
import { useCSVReader } from 'react-papaparse';
import { Button } from 'react-bootstrap';


const CSVUpload = ({checkData, saveData, text}) => {
    const { CSVReader } = useCSVReader();
    const [error, setError] = useState(null);

    return <CSVReader
        onUploadAccepted={({data}) => {
            const newData = data.map(
                value => {
                    if (value.length) {
                        return value;
                    }
                }
            );
            const errMessage = checkData(newData);
            setError(errMessage);
            if (errMessage == null) {
                saveData(newData);
            }
        }}
        config={{
            skipEmptyLines: true,
            transform: value => value.trim().toLowerCase(),
            dynamicTyping: true
        }}
    >
        {
            ({getRootProps}) => <React.Fragment>
                <Button {...getRootProps()}>
                    {text}
                </Button>
                <div>
                    {error}
                </div>
            
            </React.Fragment>
        }
    </CSVReader>;
};

export default CSVUpload;