import * as React from 'react'
import PropTypes from 'prop-types'
import Dialog from "./Dialog";
import Input from "./Input";
import Button from "./Button";

export default class PromptDialog extends React.PureComponent {
    static propTypes = {
        ...Dialog.propTypes,
        title: PropTypes.string.isRequired,
        inputLabel: PropTypes.string.isRequired,
        onSuccess: PropTypes.func.isRequired
    };

    state = {
        value: ''
    };

    render() {
        const {title, inputLabel, onSuccess, ...props} = this.props;
        const {value} = this.state;
        const styles = {
            dialog: {
                paddingTop: 0
            },
            input: {
                width: '100%',
                marginBottom: 30,
            },
            button: {
                display: 'block',
                marginLeft: 'auto'
            }
        };
        return (
            <Dialog
                {...props}
                style={styles.dialog}
            >
                <h3>{title}</h3>
                <Input
                    label={inputLabel}
                    value={value}
                    onChange={(e, value) => this.setState({value})}
                    style={styles.input}
                />
                <Button
                    label="Confirmar"
                    style={styles.button}
                    onClick={() => onSuccess(value)}
                />
            </Dialog>
        )
    }
}