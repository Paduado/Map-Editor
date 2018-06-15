import PropTypes from "prop-types";
import React, {Fragment} from "react";
import {polygonType} from "../utils/types";
import {Layer} from "./Main";

export class Polygon extends React.PureComponent {
    static propTypes = {
        polygon: polygonType.isRequired,
        onChange: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
    };

    state = {
        pointClicked: null,
        x: 0,
        y: 0,
    };

    onMouseUp = () => {
        const {onChange, polygon} = this.props;
        onChange({
            ...polygon,
            points: this.getPoints(this.state, this.props)
        });
        this.setState({
            pointClicked: null,
            x: 0,
            y: 0,
        })
    };

    getPoints = ({pointClicked, x, y}, {polygon}) => polygon.points.map(
        (point, i) => i !== pointClicked ? point : {
            x,
            y
        }
    );

    render() {
        const {polygon, getCoordinates, selected, ...props} = this.props;
        const {pointClicked} = this.state;
        const points = this.getPoints(this.state, this.props);

        const styles = {
            polygon: {
                stroke: 'black',
                strokeWidth: selected ? 1 : 0,
                fill: polygon.color,
                cursor: 'move',
            },
            point: {
                fill: 'white',
                stroke: '#777',
                cursor: pointClicked ? '-webkit-grabbing' : '-webkit-grab'
            },
            layer: {
                cursor: '-webkit-grabbing',
            }
        };
        return (
            <Fragment>
                <polygon
                    {...props}
                    points={points.map(({x, y}) => `${x} ${y}`).join(' ')}
                    style={styles.polygon}
                    onClick={e => e.stopPropagation()}
                />
                {selected && points.map(({x, y}, i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="5"
                        style={styles.point}
                        onMouseDown={() => this.setState({x, y, pointClicked: i})}
                    />
                ))}
                {pointClicked !== null && (
                    <Layer
                        style={styles.layer}
                        onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                        onMouseUp={this.onMouseUp}
                    />
                )}
            </Fragment>
        )
    }
}

export class PolygonCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired
    };
    state = {
        points: [],
        x: 0,
        y: 0
    };

    onClick = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState(({points}) => ({
            points: points.concat({x, y})
        }))
    };

    onDoubleClick = e => {
        e.preventDefault();
        const {onSuccess, onCancel} = this.props;
        const points = this.state.points.slice(0, -1);
        if(points.length > 2)
            onSuccess(points);
        else
            onCancel();
        this.setState({points: []});
    };

    render() {
        const {getCoordinates} = this.props;
        const {points, x, y} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            }
        };
        return (
            <Fragment>
                <polyline
                    fill="none"
                    stroke="#777"
                    points={points.concat({x, y}).map(
                        ({x, y}) => `${x} ${y}`
                    ).join(' ')}
                />
                <Layer
                    style={styles.layer}
                    onClick={this.onClick}
                    onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                    onDoubleClick={this.onDoubleClick}
                />
            </Fragment>
        )
    }
}

export class SquareCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired
    };
    state = {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        drawStart: false,
    };

    onStart = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState({
            startX: x,
            startY: y,
            drawStart: true
        })
    };

    onEnd = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        const {onSuccess, onCancel} = this.props;
        const {startX, startY, drawStart} = this.state;

        if(drawStart && startX !== x && startY !== y)
            onSuccess([{
                x: startX,
                y: startY
            }, {
                x: x,
                y: startY
            }, {
                x: x,
                y: y
            }, {
                x: startX,
                y: y
            }]);
        else
            onCancel();

        this.setState({
            startX: 0,
            startY: 0,
            x: 0,
            y: 0,
            drawStart: false,
        });
    };

    render() {
        const {getCoordinates} = this.props;
        const {drawStart, x, y, startX, startY} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            }
        };
        return (
            <Fragment>
                {drawStart && (
                    <polyline
                        fill="none"
                        stroke="#777"
                        points={`
                            ${startX} ${startY}
                            ${x} ${startY}
                            ${x} ${y}
                            ${startX} ${y}
                            ${startX} ${startY}
                        `}
                    />
                )}
                <Layer
                    style={styles.layer}
                    onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                    onClick={drawStart ? this.onEnd : this.onStart}
                />
            </Fragment>
        )
    }
}