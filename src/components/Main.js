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

    getCoordinates = e => {
        this.point.x = e.clientX;
        this.point.y = e.clientY;
        const {x, y} = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
        return {x, y};
    };

    addPolygon = points => {
        this.setState(({polygons}) => ({
            showPolygonCreator: false,
            polygons: polygons.concat({
                id: v4(),
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
            svgContainer: {
                height: 0,
                width: '100%',
                flexGrow: 1,
                alignSelf: 'center'
            },
            svg: {
                border: '1px solid #ddd',
                height: '100%',
                display: 'block',
                margin: '0 auto',
                background: 'white'
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
                <div style={styles.svgContainer}>
                    <SvgContext.Provider value={this.svg}>
                        <svg
                            viewBox="0 0 1000 1000"
                            style={styles.svg}
                            ref={this.ref}
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
                    </SvgContext.Provider>
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

    onClick = ({x, y}) => {
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
                    onClick={e => this.onClick(getCoordinates(e))}
                    onMouseMove={e => this.setState(getCoordinates(e))}
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
        y: 0
    };

    onMouseUp = () => {
        const {onChange, polygon} = this.props;
        const {pointClicked, x, y} = this.state;
        onChange({
            ...polygon,
            points: polygon.points.map(
                (point, i) => i !== pointClicked ? point : {
                    x,
                    y
                }
            )
        });
        this.setState({
            pointClicked: null,
            x: 0,
            y: 0
        })
    };

    render() {
        const {polygon, getCoordinates} = this.props;
        const {pointClicked, x, y} = this.state;
        const points = polygon.points.map(
            (p, i) => i !== pointClicked ? p : {
                x,
                y
            }
        );
        const styles = {
            polygon: {
                stroke: '#ddd',
                fill: green,
                pointerEvents: 'all'
            },
            point: {
                fill: 'white',
                stroke: '#777',
                cursor: '-webkit-grab'
            },
            layer: {
                cursor: '-webkit-grabbing',
            }
        };
        return (
            <Fragment>
                <polygon
                    points={points.map(({x, y}) => `${x} ${y}`).join(' ')}
                    style={styles.polygon}
                />
                {points.map(({x, y}, i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        style={styles.point}
                        onMouseDown={e => this.setState({
                            ...getCoordinates(e),
                            pointClicked: i
                        })}
                    />
                ))}
                {pointClicked !== null && (
                    <Layer
                        style={styles.layer}
                        onMouseMove={e => this.setState(getCoordinates(e))}
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