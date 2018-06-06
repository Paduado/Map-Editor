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
        onSuccess: PropTypes.func.isRequired,
        defaultValue: PropTypes.string,
    };

    static defaultProps = {
        defaultValue: ''
    };

    state = {
        value: ''
    };

    input = React.createRef();

    componentDidUpdate(prevProps) {
        const {open, defaultValue} = this.props;
        if(open && !prevProps.open) {
            this.setState({value: defaultValue});
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
            header: {
                fontWeight: 600,
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
                <h3 style={styles.header}>{title}</h3>
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