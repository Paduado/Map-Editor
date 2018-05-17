import * as React from 'react'
import PropTypes from 'prop-types'
import * as ReactDOM from "react-dom";

export default class Menu extends React.Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.any.isRequired,
            onClick: PropTypes.func.isRequired
        })).isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        style: PropTypes.object,
    };


    container = document.createElement('div');

    componentDidMount() {
        document.body.appendChild(this.container);
    }

    componentWillUnmount() {
        document.body.removeChild(this.container);
    }

    render() {
        const {open, onClose, options, x, y, style} = this.props;
        const styles = {
            wrapper: {
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: '1000'
            },
            container: {
                minWidth: '200px',
                background: 'white',
                borderRadius: '3px',
                position: 'absolute',
                top: y,
                left: x,
                overflow: 'hidden',
                border: '1px solid #ddd',
                ...style
            },
        };
        document.body.style.overflow = open ? 'hidden' : '';
        return open && (
            ReactDOM.createPortal((
                <div style={styles.wrapper} onClick={onClose}>
                    <div style={styles.container} onClick={e => e.stopPropagation()}>
                        {options.map(({label, onClick}) => (
                            <Option
                                key={label}
                                label={label}
                                onClick={() => {
                                    onClick();
                                    onClose();
                                }}
                            />
                        ))}
                    </div>
                </div>
            ), this.container)
        )
    }
}

class Option extends React.PureComponent {
    static propTypes = {
        label: PropTypes.any.isRequired,
        onClick: PropTypes.func.isRequired
    };

    state = {hover: false};

    render() {
        const {label, onClick} = this.props;
        const {hover} = this.state;
        const styles = {
            container: {
                width: '100%',
                padding: '8px',
                background: hover && '#f7f7f7',
                boxSizing: 'border-box',
                cursor: 'pointer',
                fontFamily: 'Proxima Nova, sans-serif',
                fontSize: '.9rem'
            }
        };
        return (
            <div
                onClick={onClick}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                style={styles.container}
            >
                {label}
            </div>
        )
    }
}