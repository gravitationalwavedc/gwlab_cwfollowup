import React from 'react'

const followupOptions = [
    {
        value: 'lines',
        label: 'Lines',
        description: 'Compare candidate detections to a list of frequencies from Livingston and Hanford detectors during the appropriate oberving run. Produce plots showing whether or not these candidates should be treated as legitimate detections.',
        shortDescription: 'Compare candidates to bad frequencies from the Livingston and Hanford detectors.',
    },
    {
        value: 'psd_plotter',
        label: 'PSD Plotter',
        description: <React.Fragment>Plot the power spectral density (of the data from the observing run in which the candidate was found) in frequency space around the candidate. Useful for finding unknown noise lines or fluctuations that may cause a false detection. Uses a harmonic mean to average between input  <abbr title="Short Fourier Transform">SFT</abbr> blocks and detectors.</React.Fragment>,
        shortDescription: 'Plot power spectral density around the candidate.',
    }
]

export default followupOptions;