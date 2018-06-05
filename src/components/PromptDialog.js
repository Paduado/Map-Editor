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

    input = React.createRef();

    componentDidUpdate(prevProps) {
        if(this.props.open && !prevProps.open) {
            setTimeout(() => {
                this.input.current.focus()
            }, 300)
        }

    }

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
                margin: '10px 10px 10px auto'
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
                    ref={this.input}
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