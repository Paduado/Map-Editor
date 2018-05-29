/*eslint eqeqeq: "off"*/
import React from 'react';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down'
import PropTypes from 'prop-types'
import * as ReactDOM from "react-dom";

export default class DefaultSelect extends React.PureComponent {
    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.any.isRequired,
            value: PropTypes.any
        })).isRequired,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        allowUndefined: PropTypes.bool,
        disabled: PropTypes.bool,
        containerStyle: PropTypes.object,
        labelStyle: PropTypes.object,
        selectStyle: PropTypes.object,
    };

    state = {
        open: false
    };

    select = React.createRef();

    getText = () => {
        const {options, value} = this.props;
        const option = options.find(o => o.value == value);
        return option && option.text;
    };


    onClose = () => this.setState({open: false});

    onOptionSelected = value => {
        this.onClose();
        this.props.onChange(value);
    };

    render() {
        const text = this.getText();
        const {label, placeholder, allowUndefined, disabled, containerStyle, labelStyle, selectStyle, value} = this.props;
        const {open} = this.state;

        const options = [
            ...(
                allowUndefined
                && this.props.options.some(o => o.value === undefined)
                    ? [{text: 'Todos'}]
                    : []
            ),
            ...this.props.options
        ];

        const styles = {
            container: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: '0',
                pointerEvents: disabled ? 'none' : 'all',
                opacity: disabled ? '.5' : '1',
                ...containerStyle
            },
            label: {
                fontSize: '.8rem',
                color: '#8bc249',
                marginBottom: '3px',
                ...labelStyle
            },
            select: {
                background: 'white',
                minWidth: '150px',
                height: '30px',
                padding: '0 5px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '.9rem',
                flexShrink: '0',
                ...selectStyle
            },
            popover: {
                border: '1px solid #ddd',
                borderRadius: '3px',
                marginTop: '-1px'
            },
            list: {
                maxHeight: '300px',
                overflow: 'auto'
            },
            arrow: {
                marginLeft: '10px'
            }
        };

        return (
            <div style={styles.container}>
                <div style={styles.label}>{label}</div>
                <div
                    style={styles.select}
                    onClick={() => this.setState({open: true})}
                    ref={this.select}
                >
                    {text ? (
                        <div style={{color: 'black'}}>{text}</div>
                    ) : (
                        <div style={{color: '#aaa'}}>{placeholder}</div>
                    )}
                    <ArrowDown style={styles.arrow}/>
                </div>
                <Popover
                    open={open}
                    onClose={this.onClose}
                    anchorEl={this.select.current}
                    style={styles.popover}
                >
                    <div style={styles.list}>
                        {options.map((option, i) => (
                            <Option
                                key={i}
                                label={option.text}
                                selected={option.value == value}
                                onClick={() => this.onOptionSelected(option.value)}
                            />
                        ))}
                    </div>
                </Popover>
            </div>
        )
    }
}

class Popover extends React.PureComponent {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        anchorEl: PropTypes.object,
        style: PropTypes.object
    };

    div = document.createElement('div');

    componentDidMount() {
        document.body.appendChild(this.div)
    }

    componentWillUnmount() {
        document.body.removeChild(this.div)
    }

    render() {
        const {open, onClose, anchorEl, style, ...props} = this.props;
        const {bottom = 0, left = 0} = anchorEl ? anchorEl.getBoundingClientRect() : {};
        const styles = {
            wrapper: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 3000,
            },
            container: {
                position: 'fixed',
                top: bottom,
                left,
                background: 'white',
                ...style
            }
        };
        return open && ReactDOM.createPortal((
            <div style={styles.wrapper} onClick={onClose}>
                <div
                    {...props}
                    style={styles.container}
                />
            </div>
        ), this.div)
    }
}

class Option extends React.PureComponent {
    state = {
        hover: false
    };
    container = React.createRef();

    componentDidMount() {
        if(this.props.selected)
            this.container.current.scrollIntoView()
    }

    render() {
        const {label, selected, ...props} = this.props;
        const {hover} = this.state;
        const style = {
            width: '100%',
            padding: '5px 10px',
            cursor: 'pointer',
            background: (selected || hover) && '#eee'
        };
        return (
            <div
                {...props}
                ref={this.container}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                style={style}
            >
                {label}
            </div>
        )
    }
}
