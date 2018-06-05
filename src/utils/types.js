import PropTypes from 'prop-types'

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