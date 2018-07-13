import PropTypes from "prop-types";
import React, {Fragment} from "react";
import {Layer} from "./Main";

export class Text extends React.PureComponent {
    static propTypes = {
        text: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            value: PropTypes.string.isRequired,
            size: PropTypes.any.isRequired,
        }),
        getCoordinates: PropTypes.func.isRequired,
        selected: PropTypes.bool,
    };

    state = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    componentDidMount() {
        this.measure();
    }

    componentDidUpdate() {
        this.measure();
    }

    measure = () => {
        const {
            x,
            y,
            width,
            height
        } = this.text ? this.text.getBBox() : {};
        if(
            (x !== this.state.x)
            || (y !== this.state.y)
            || (width !== this.state.width)
            || (height !== this.state.height)
        )
            this.setState({x, y, width, height})

    };

    render() {
        const {text, selected, onMouseDown} = this.props;
        const {
            x,
            y,
            width,
            height
        } = this.text ? this.text.getBBox() : {};
        const styles = {
            text: {
                cursor: 'pointer',
                fontSize: text.size + 'rem'
            },
            box: {
                fill: 'none',
                stroke: 'black',
                strokeDasharray: 2
            }
        };
        return (
            <Fragment>
                <text
                    x={text.x}
                    y={text.y}
                    style={styles.text}
                    onClick={e => e.stopPropagation()}
                    ref={text => this.text = text}
                    onMouseDown={onMouseDown}
                >
                    {text.value}
                </text>
                {selected && (
                    <rect
                        style={styles.box}
                        x={x - 5}
                        y={y - 5}
                        width={width + 10}
                        height={height + 10}
                    />
                )}
            </Fragment>
        )
    }
}

export class TextCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired
    };
    state = {
        x: 0,
        y: 0,
    };

    onEnd = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        const {onSuccess} = this.props;
        onSuccess({x, y});
        this.setState({
            x: 0,
            y: 0,
        });
    };

    render() {
        const {getCoordinates} = this.props;
        const {x, y} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            },
            text: {
                pointerEvents: 'none',
            }
        };
        return (
            <Fragment>
                <text
                    style={styles.text}
                    x={x}
                    y={y}
                >
                    Texto
                </text>
                <Layer
                    style={styles.layer}
                    onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                    onClick={this.onEnd}
                />
            </Fragment>
        )
    }
}

