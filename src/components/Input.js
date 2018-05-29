import React from 'react';
import PropTypes from 'prop-types'


const Input = React.forwardRef(({
    label,
    color,
    style,
    inputStyle,
    labelStyle,
    disabled,
    onChange,
    ...props
}, ref) => {
    const styles = {
        container: {
            position: 'relative',
            flexShrink: '0',
            width: '200px',
            maxWidth: '100%',
            fontSize: '.9rem',
            ...style,
            pointerEvents: disabled && 'none',
            opacity: disabled && '.5'
        },
        label: {
            fontSize: '.8rem',
            marginBottom: '3px',
            color: color || '#8bc249',
            ...labelStyle
        },
        input: {
            width: '100%',
            padding: '0 5px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            fontSize: '1em',
            height: '30px',
            ...inputStyle
        }
    };
    return (
        <div style={styles.container}>
            {label && <div style={styles.label}>{label}</div>}
            <input
                {...props}
                style={styles.input}
                onChange={e => onChange(e, e.target.value)}
                ref={ref}
            />
        </div>
    )
});

Input.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
    ]),
    color: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    inputStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    style: PropTypes.object,
    disabled: PropTypes.bool
};

export default Input
