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

export const Add = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export const Square = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/>
    </svg>
);

export const Polygon = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <defs>
            <path id="a" d="M0 0h24v24H0V0z"/>
        </defs>
        <clipPath id="b">
            <use xlinkHref="#a" overflow="visible"/>
        </clipPath>
        <path clipPath="url(#b)" d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"/>
    </svg>
);

export const FootballField = props => {
    const lineStyle = {
        fill: 'none',
        stroke: '#FFFFFF',
    };
    return (
        <svg viewBox="238 224 257 165" {...props}>
            <path fill="#83C15B" d="M256.3,389.8c-9.8,0-17.7-7.9-17.7-17.7V242.6c0-9.8,7.9-17.7,17.7-17.7h221.8
			c9.8,0,17.7,7.9,17.7,17.7v129.6c0,9.8-7.9,17.7-17.7,17.7H256.3z"/>
            <path fill="#FFFFFF" d="M478.1,225.2c9.6,0,17.3,7.8,17.3,17.3v129.6c0,9.6-7.8,17.3-17.3,17.3H256.3
			c-9.6,0-17.3-7.8-17.3-17.3V242.6c0-9.6,7.8-17.3,17.3-17.3H478.1 M478.1,224.5H256.3c-10,0-18.1,8.1-18.1,18.1v129.6
			c0,10,8.1,18.1,18.1,18.1h221.8c10,0,18.1-8.1,18.1-18.1V242.6C496.2,232.6,488.1,224.5,478.1,224.5L478.1,224.5z"/>
            <line style={lineStyle} x1="366.6" y1="389.4" x2="366.6" y2="225.3"/>
            <ellipse style={lineStyle} cx="367.2" cy="306.9" rx="15.6" ry="15.9"/>
            <polyline style={lineStyle} points="239.3,266.7 273.1,266.7 273.1,347.2 239.3,347.2"/>
            <polyline style={lineStyle} points="239.3,291.8 248.8,291.8 248.8,322.2 239.3,322.2"/>
            <path style={lineStyle} d="M272.9,293.4 c4.1,3.1,6.1,8,6.1,13.6c0,5.8-1.7,10.5-6.1,13.6"/>
            <polyline style={lineStyle} points="495.5,266.7 461.6,266.7 461.6,347.2 495.5,347.2"/>
            <polyline style={lineStyle} points="495.5,291.8 486,291.8 486,322.2 495.5,322.2"/>
            <path style={lineStyle} d="M461.5,293.1 c-4.1,3.1-7.3,8.3-7.3,13.9c0,5.8,3,10.8,7.3,13.9"/>
        </svg>
    );
};

export const BaseballField = props => (
    <svg viewBox="790 200 2000 1800" {...props}>
        <path fill="#82C05B" d="M2742.9,701.1l-92.3-95.8C2522,487.5,2400.5,399,2279.4,335c-149-78.8-300.4-120.9-450.2-125.1h-89
		C1590.4,214.1,1439,256.2,1290,335c-121.1,64-242.6,152.5-371.2,270.3l-92.3,95.8c-36.2,37.4-35.9,96.9,0.5,134.1l159,162.4
		l-23,205c-6.8,60.8,9.2,122,44.9,171.7l200.6,279.3c15.5,21.6,34.4,40.5,55.9,56.1l375.4,231.7c42.1,30.5,92.9,46.9,144.9,46.9
		s102.8-16.4,144.9-46.9l375.4-231.7c21.5-15.6,40.4-34.5,55.9-56.1l200.6-279.3c35.7-49.7,51.7-110.9,44.9-171.7l-23-205l159-162.4
		C2778.9,798,2779.2,738.5,2742.9,701.1z"/>
        <path fill="#F09E54" d="M1389.3,1436.8L1193,1241l-43.1-41.5c70-285,327.3-496.5,633.9-496.5c315.3,0,574.9,205.1,635.8,502.5
		l-28.5,29l-547.7,535.6l-0.2,120.7l-125.2,0.4l-0.9-121.6L1389.3,1436.8"/>
        <path fill="white" d="M1712.3,1896.9l-0.9-125.1L1385.2,1441L1189,1245.2l-45.5-43.8l0.8-3.3c17.4-70.9,46.5-138.4,86.2-199.6
		c121.1-188.1,329.6-301.7,553.3-301.4c78.2,0,154.1,12.5,225.7,37c69.2,23.6,133.9,58.7,191.2,104
		c56.7,44.7,105.1,98.9,143.1,160.3c39.1,63.3,66.7,133,81.5,205.8l0.6,3.1l-30.7,31.3l-545.9,533.8l-0.2,124L1712.3,1896.9z
		 M1156.5,1197.7l40.7,39.2l196.3,195.9L1723,1767l0.9,118.2l113.5-0.3l0.2-117.3l1.8-1.7l547.7-535.5l26.2-26.7
		c-14.6-70.4-41.5-137.8-79.3-199c-37.3-60.2-84.8-113.4-140.4-157.2c-56.3-44.5-119.8-79-187.8-102.1
		c-70.4-24.1-145-36.4-221.9-36.4C1487.6,709.1,1229.2,910.4,1156.5,1197.7L1156.5,1197.7z"/>
        <path fill="#82C05B" d="M2177.2,1175.7l-287.4-287.4c-55.6,51.7-142.1,51.7-197.7,0L1396,1184.4c51.7,55.6,51.7,142.1,0,197.7
		l287.4,287.4c55.6-51.7,142.1-51.7,197.7,0l296.1-296.1C2125.5,1317.8,2125.5,1231.3,2177.2,1175.7z"/>
        <path fill="white" d="M1889.8,873.4l302.3,302.3l-3.8,3.8c-52.5,52.5-52.5,137.9,0,190.3l3.8,3.8l-311,311l-3.8-3.8
		c-52.5-52.5-137.9-52.5-190.3,0l-3.8,3.8l-302.3-302.5l3.8-3.8c52.5-52.5,52.5-137.9,0-190.3l-3.8-3.8l311-311l3.8,3.8
		c52.5,52.5,137.9,52.5,190.3,0L1889.8,873.4z M2177.2,1175.7l-287.4-287.4c-55.6,51.7-142.1,51.7-197.7,0l-296.1,296
		c51.7,55.6,51.7,142.1,0,197.7l287.4,287.4c55.6-51.7,142.1-51.7,197.7,0l296.1-296.1C2125.5,1317.8,2125.5,1231.3,2177.2,1175.7
		L2177.2,1175.7z"/>
        <circle fill="white" cx="1943.9" cy="1796.7" r="22.2"/>
        <path fill="white" d="M1721.8,1885.5v-153.1h115.4v153.1H1721.8 M1711.2,1896.2H1848v-174.3h-136.8V1896.2L1711.2,1896.2z"/>
        <rect x="1812" y="1730.7" fill="white" width="29.2" height="44.8"/>
        <rect x="1717.2" y="1728.2" fill="white" width="29.2" height="44.8"/>
        <circle fill="white" cx="1612.5" cy="1796.7" r="22.2"/>
        <circle fill="white" cx="1786.6" cy="1278.8" r="57.9"/>

        <rect x="1313.2" y="1237.6" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -500.275 1314.6871)" fill="white" width="47.3" height="47.3"/>
        <polygon fill="white" points="1764.2,1744.3 1792.3,1744.3 1792.3,1772.3 1776.4,1784.4 1764.2,1772.3 	"/>
        <rect x="1773.9" y="783.6" fill="white" width="47.3" height="47.3"/>

        <rect x="2201" y="1237.6" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -240.2632 1942.46)" fill="white" width="47.3" height="47.3"/>
        <path fill="white" d="M2190.6,1422.5l233.2-229.3l7.7,65.2L2272.9,1417L2190.6,1422.5z M2414.9,1218.4l-193.4,190.3l46.2-3.1
		l151.4-151.4L2414.9,1218.4z"/>
        <path fill="white" d="M1377.8,1422.5l-82.2-5.5L1137,1258.4l7.7-65.2L1377.8,1422.5z M1300.8,1405.5l46.2,3.1l-193.4-190.3
		l-4.2,35.7L1300.8,1405.5z"/>
    </svg>
);

export const Seat = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M15,5v7H9V5H15 M15,3H9C7.9,3,7,3.9,7,5v9h10V5C17,3.9,16.1,3,15,3L15,3z M22,10h-3v3h3V10L22,10z M5,10H2v3h3V10L5,10z
		 M20,15H4v6h2v-4h12v4h2V15L20,15z"/>
    </svg>
);

export const Save = props => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
);

