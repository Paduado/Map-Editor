import React from "react";
import Radium from 'radium'
import Color from 'color'
import PropTypes from 'prop-types';

class DefaultButton extends React.PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        color: PropTypes.string,
        style: PropTypes.object,
        disabled: PropTypes.bool,
        invert: PropTypes.bool,
    };
    static defaultProps = {
        onClick: () => {}
    };

    render() {
        const {label, onClick, color, disabled, invert, style} = this.props;
        const defaultStyle = {
            background: !invert ? (disabled ? '#ccc' : '#8bc249') : 'transparent',
            color: color || !invert ? 'white' : (disabled ? '#ccc' : '#8bc249'),
            padding: '0 10px',
            minWidth: '100px',
            textTransform: 'uppercase',
            height: '32px',
            border: 0,
            borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all .2s',
            fontSize: '.85rem',
            margin: '10px',
            fontFamily: 'Proxima nova',
            pointerEvents: disabled ? 'none' : 'all',
            ':hover': !invert ? {
                background: Color('#8bc249').lighten(-.2)
            } : {
                background: 'rgba(0,0,0,.05)'
            },
            ...style
        };
        return (
            <button
                style={defaultStyle}
                onClick={onClick}
            >
                {label || ''}
            </button>
        )
    }
}

export default Radium(DefaultButton);