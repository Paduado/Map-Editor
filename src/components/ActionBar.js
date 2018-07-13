import * as React from 'react'
import PropTypes from 'prop-types'
import Radium from "radium";
import Color from "color";

const ActionBar = ({style, ...props}) => {
    const defaultStyle = {
        height: 80,
        padding: 10,
        background: 'white',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        borderBottom: '1px solid #ddd',
        ...style
    };
    return (
        <div
            {...props}
            style={defaultStyle}
        />
    )
};
ActionBar.propTypes = {
    style: PropTypes.object,
};

export default ActionBar;

export const ActionButton = Radium(({
    icon,
    label,
    style,
    onClick,
    disabled,
    background = '#eee',
    color = '#555',
}) => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 100ms',
            cursor: 'pointer',
            border: '0',
            padding: 5,
            width: 60,
            height: 60,
            borderRadius: 3,
            fill: color,
            margin:5,
            color,
            background: background,
            ':hover': {
                background: Color(background).lighten(-.1)
            },
            ':active': {
                background: Color(background).lighten(-.2)
            },
            ...style,
            ...(disabled && {
                opacity: .5,
                pointerEvents: 'none'
            })
        },
        label: {
            fontSize: '.8rem',
        }
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={styles.container}
        >
            {icon}
            <div style={styles.label}>
                {label}
            </div>
        </button>
    )
});
ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
    icon: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    background: PropTypes.string,
    color: PropTypes.string,
};