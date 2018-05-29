import * as React from 'react'
import PropTypes from 'prop-types'
import * as ReactDOM from "react-dom";

const initialState = {
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
    show: false
};

export default class Selector extends React.PureComponent {
    static propTypes = {
        children: PropTypes.element.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    state = initialState;
    container = document.createElement('div');

    componentDidMount() {
        document.body.appendChild(this.container);
    }

    componentWillUnmount() {
        document.body.removeChild(this.container);
    }

    onMouseDown = e => {
        e.preventDefault();
        const {clientX, clientY} = e;
        this.setState({
            startX: clientX,
            endX: clientX,
            startY: clientY,
            endY: clientY,
            show: true
        });
    };

    onMouseMove = ({clientX, clientY}) => this.setState({
        endX: clientX,
        endY: clientY
    });

    onMouseUp = () => this.setState(({startX, endX, startY, endY}, {onSelect}) => {
        onSelect({
            x1: Math.min(startX, endX),
            x2: Math.max(startX, endX),
            y1: Math.min(startY, endY),
            y2: Math.max(startY, endY),
        });
        return initialState;
    });
    onMouseLeave = () => this.setState(initialState);

    render() {
        const {children} = this.props;
        const {
            show,
            startX,
            startY,
            endX,
            endY
        } = this.state;

        const styles = {
            element: {
                ...children.props.style,
                cursor: 'crosshair'
            },
            selector: {
                border: '1px solid #444',
                background: 'rgba(0,0,0,.3)',
                position: 'fixed',
                top: Math.min(startY, endY),
                left: Math.min(startX, endX),
                height: Math.abs(startY - endY),
                width: Math.abs(startX - endX),
                zIndex: 10,
                pointerEvents: 'none'
            },
        };
        return (
            <React.Fragment>
                {React.cloneElement(children, {
                    style: styles.element,
                    onMouseDown: this.onMouseDown,
                    onMouseMove: show ? this.onMouseMove : undefined,
                    onMouseUp: show ? this.onMouseUp : undefined,
                    onMouseLeave: show ? this.onMouseLeave : undefined,
                })}
                {ReactDOM.createPortal(show && (
                    <div style={styles.selector}/>
                ), this.container)}
            </React.Fragment>
        )
    }
}