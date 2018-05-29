import * as React from 'react'
import PropTypes from 'prop-types'
import * as ReactDOM from "react-dom";
import {Transition} from "react-transition-group";

export default class Dialog extends React.Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func,
        layerStyle: PropTypes.object,
        style: PropTypes.object,
    };
    static defaultProps = {
        onClose: () => {}
    };

    div = document.createElement('div');

    componentDidMount() {
        document.body.appendChild(this.div);
    }

    componentWillUnmount() {
        document.body.removeChild(this.div);
    }

    onClose = e => {
        e.stopPropagation();
        const {onClose} = this.props;
        onClose();
    };

    render() {
        const {open, children, style, layerStyle} = this.props;
        const delay = 200;
        const styles = {
            layer: transition => ({
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                background: 'rgba(0,0,0,.5)',
                position: 'fixed',
                padding: '20px 0',
                top: 0,
                left: 0,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                ...layerStyle,
                transition: `opacity ${delay}ms, visibility ${delay}ms`,
                transform: 'translateZ(0)',
                opacity: '0',
                visibility: 'hidden',
                ...({
                    entering: {
                        opacity: '1',
                        visibility: 'visible'
                    },
                    entered: {
                        opacity: '1',
                        visibility: 'visible'
                    }
                }[transition])

            }),
            container: transition => ({
                width: '300px',
                margin: 'auto',
                background: 'white',
                padding: '10px',
                borderRadius: '3px',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px',
                position: 'relative',
                ...style,
                transition: `transform ${delay}ms`,
                transform: 'translateY(-50px)',
                ...({
                    entering: {
                        transform: 'scale(1)',
                    },
                    entered: {
                        transform: 'scale(1)',
                    }
                }[transition])
            }),
            loading: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                background: 'rgba(0,0,0,.1)'
            }
        };
        document.body.style.overflow = open ? 'hidden' : '';

        return ReactDOM.createPortal((
            <Transition in={open} timeout={delay}>
                {transition => (
                    <div style={styles.layer(transition)} onClick={this.onClose}>
                        <div style={styles.container(transition)} onClick={e => e.stopPropagation()}>
                            {children}
                        </div>
                    </div>
                )}
            </Transition>
        ), this.div)
    }
}