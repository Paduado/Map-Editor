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
        <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
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