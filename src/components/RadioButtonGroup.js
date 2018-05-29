import * as React from 'react'
import PropTypes from 'prop-types'
import {RadioSelected, RadioUnselected} from "./svgs";

const RadioContext = React.createContext();

const RadioButtonGroup = ({value, onChange, children, label}) => {
    const styles = {
        container: {},
        label: {
            fontSize: '.8rem',
            marginBottom: '3px',
            color: '#8bc249',
        },
    };
    return (
        <RadioContext.Provider value={{value, onChange}}>
            <div style={styles.container}>
                {label && (
                    <div style={styles.label}>
                        {label}
                    </div>
                )}
                {children}
            </div>
        </RadioContext.Provider>
    )
};

RadioButtonGroup.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string
};

export default RadioButtonGroup;

export const RadioButton = ({value, children, ...props}) => (
    <RadioContext.Consumer>
        {({value: currentValue, onChange}) => {
            const styles = {
                container: {
                    display: 'flex',
                    cursor: 'pointer',
                    margin: '10px 0',
                    alignItems: 'center',
                },
                label: {
                    marginLeft: 5
                },
                button:{
                    flexShrink: 0
                }
            };
            const selected = value === currentValue;
            return (
                <div
                    {...props}
                    style={styles.container}
                    onClick={() => onChange(value)}
                >
                    {selected
                        ? <RadioSelected style={styles.button}/>
                        : <RadioUnselected style={styles.button}/>
                    }
                    <div style={styles.label}>
                        {children}
                    </div>
                </div>
            )
        }}
    </RadioContext.Consumer>
);

