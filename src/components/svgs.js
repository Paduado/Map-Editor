import React from "react";

export const RadioUnselected = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#999" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const RadioSelected = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#8bc249" {...props}>
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const Delete = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
);

export const Text = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M5 4v3h5.5v12h3V7H19V4z"/>
        <path fill="none" d="M0 0h24v24H0V0z"/>
    </svg>
);

export const Generate = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const Undo = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
    </svg>
);

export const Cross = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const DeleteRow = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"/>
    </svg>
);

export const AlignRight = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const AlignLeft = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const AlignCenter = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const Download = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);