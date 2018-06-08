import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import ActionBar, {ActionButton} from "./ActionBar";
import {Add} from "./svgs";
import {green, lightBlue} from "../utils/colors";
import {v4} from 'uuid'
import {pointType} from "../utils/types";
import * as ReactDOM from "react-dom";

const SvgContext = React.createContext();

export default class Main extends React.PureComponent {
    state = {
        polygons: [],
        showPolygonCreator: false,
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.forceUpdate());
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.forceUpdate());
    }

    ref = svg => {
        this.svg = svg;
        this.point = svg.createSVGPoint();
    };

    getCoordinates = (X, Y, round = true) => {
        this.point.x = X;
        this.point.y = Y;
        const {x, y} = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
        return round ? {
            x: Math.round(x / 10) * 10,
            y: Math.round(y / 10) * 10,
        } : {
            x, y
        };
    };

    addPolygon = points => {
        this.setState(({polygons}) => ({
            showPolygonCreator: false,
            polygons: polygons.concat({
                id: v4(),
                name: `Figura ${polygons.length + 1}`,
                points
            }),
        }))
    };

    onPolygonChange = polygon => {
        this.setState(({polygons}) => ({
            polygons: polygons.map(p => p.id !== polygon.id ? p : polygon)
        }));
    };

    render() {
        const {showPolygonCreator, polygons} = this.state;
        const styles = {
            container: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                background: lightBlue
            },
            mainContainer: {
                display: 'flex',
                height: 0,
                flexGrow: 1
            },
            svgContainer: {
                flexGrow: 1,
            },
            svg: {
                border: '1px solid #ddd',
                height: '100%',
                display: 'block',
                margin: '0 auto',
                background: 'white',
            },
            sidebar: {
                background: 'white',
                width: 300,
                height: '100%',
                borderLeft: '1px solid #ddd'
            },
            polygonRow: {
                height: 100,
                borderBottom: '1px solid #ddd'
            }
        };
        return (
            <div style={styles.container}>
                <ActionBar>
                    <ActionButton
                        label="Nueva sección"
                        icon={<Add/>}
                        onClick={() => this.setState({showPolygonCreator: true})}
                    />
                </ActionBar>
                <div style={styles.mainContainer}>
                    <SvgContext.Provider value={this.svg}>
                        <div style={styles.svgContainer}>
                            <svg
                                viewBox="0 0 1000 1000"
                                style={styles.svg}
                                ref={this.ref}
                                preserveAspectRatio="xMinYMin"
                            >
                                <Grid lines={100} step={10}/>
                                {showPolygonCreator && (
                                    <PolygonCreator
                                        onSuccess={this.addPolygon}
                                        onCancel={() => this.setState({showPolygonCreator: false})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {polygons.map(polygon => (
                                    <Polygon
                                        key={polygon.id}
                                        polygon={polygon}
                                        onChange={polygon => this.onPolygonChange(polygon)}
                                        getCoordinates={this.getCoordinates}
                                    />
                                ))}
                            </svg>
                        </div>
                    </SvgContext.Provider>
                    <div style={styles.sidebar}>
                        {polygons.map(polygon => (
                            <div
                                key={polygon.id}
                                style={styles.polygonRow}
                            >
                                {polygon.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const Layer = ({style, ...props}) => (
    <SvgContext.Consumer>
        {svg => {
            const {
                top,
                left,
                width,
                height
            } = svg ? svg.getBoundingClientRect() : {};
            const defaultStyle = {
                width,
                height,
                top,
                left,
                position: 'fixed',
                ...style
            };
            return ReactDOM.createPortal((
                <div
                    {...props}
                    style={defaultStyle}
                />
            ), document.getElementById('modal-root'));
        }}
    </SvgContext.Consumer>
);

class PolygonCreator extends React.PureComponent {
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

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = ({key}) => {
        if(key === 'Escape')
            this.props.onCancel();
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
                    stroke="darkcyan"
                    points={points.concat({x, y}).map(
                        ({x, y}) => `${x} ${y}`
                    ).join(',')}
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

class Polygon extends React.PureComponent {
    static propTypes = {
        polygon: PropTypes.shape({
            points: PropTypes.arrayOf(pointType).isRequired,
        }).isRequired,
        onChange: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired,
    };

    state = {
        pointClicked: null,
        x: 0,
        y: 0,
        dragging: false,
        dragStartX: 0,
        dragStartY: 0
    };

    figure = React.createRef();

    componentDidMount() {
        this.forceUpdate();
    }

    onMouseUp = () => {
        const {onChange, polygon} = this.props;
        const {pointClicked, x, y, dragging, dragStartX, dragStartY} = this.state;
        onChange({
            ...polygon,
            points: polygon.points.map(
                (point, i) => dragging ? {
                    x: point.x + x - dragStartX,
                    y: point.y + y - dragStartY,
                } : i !== pointClicked ? point : {
                    x,
                    y
                }
            )
        });
        this.setState({
            pointClicked: null,
            x: 0,
            y: 0,
            dragStartX: 0,
            dragStartY: 0,
            dragging: false
        })
    };

    onDragStart = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState({
            dragging: true,
            dragStartX: x,
            dragStartY: y,
            x,
            y
        })
    };

    onMouseMove = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState({x, y})
    };

    render() {
        const {polygon, getCoordinates} = this.props;
        const {pointClicked, x, y, dragging, dragStartX, dragStartY} = this.state;
        const {
            top = 0,
            left = 0,
            width = 0,
            height = 0,
        } = this.figure.current ? this.figure.current.getBoundingClientRect() : {};

        const {x: textX, y: textY} = getCoordinates(left + width / 2, top + height / 2, false);

        const points = polygon.points.map(
            (point, i) => dragging ? {
                x: point.x + x - dragStartX,
                y: point.y + y - dragStartY,
            } : i !== pointClicked ? point : {
                x,
                y
            }
        );
        const styles = {
            polygon: {
                stroke: '#ddd',
                fill: green,
                cursor: 'move'
            },
            point: {
                fill: 'white',
                stroke: '#777',
                cursor: pointClicked ? '-webkit-grabbing' : '-webkit-grab'
            },
            layer: {
                cursor: '-webkit-grabbing',
            },
            text: {
                textAnchor: 'middle',
                dominantBaseline: 'central'
            }
        };
        return (
            <Fragment>
                <polygon
                    points={points.map(({x, y}) => `${x} ${y}`).join(' ')}
                    style={styles.polygon}
                    onMouseDown={this.onDragStart}
                    onMouseMove={dragging ? this.onMouseMove : undefined}
                    onMouseUp={dragging ? this.onMouseUp : undefined}
                    ref={this.figure}
                />
                {points.map(({x, y}, i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="5"
                        style={styles.point}
                        onMouseDown={e => this.setState({
                            ...getCoordinates(e.clientX, e.clientY),
                            pointClicked: i
                        })}
                    />
                ))}
                <text
                    x={textX}
                    y={textY}
                    style={styles.text}
                >
                    {polygon.name}
                </text>
                {pointClicked !== null && (
                    <Layer
                        style={styles.layer}
                        onMouseMove={this.onMouseMove}
                        onMouseUp={this.onMouseUp}
                    />
                )}
            </Fragment>
        )
    }
}

const Grid = ({lines, step}) => {
    return Array.from({length: lines - 1}, (_, i) => (
        <React.Fragment key={i}>
            <line
                x1="0"
                x2="1000"
                y1={(i + 1) * step}
                y2={(i + 1) * step}
                stroke="#eee"
                strokeWidth="1"
            />
            <line
                x1={(i + 1) * step}
                x2={(i + 1) * step}
                y1="0"
                y2="1000"
                stroke="#eee"
                strokeWidth="1"
            />
        </React.Fragment>
    ));
};