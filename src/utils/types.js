import PropTypes from 'prop-types'

export const pointType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
});

export const seatType = PropTypes.shape({
    row: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    col: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    radium: PropTypes.number.isRequired,
});

export const polygonType = PropTypes.shape({
    color: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(pointType).isRequired,
});