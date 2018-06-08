import React from 'react';
import PropTypes from 'prop-types'
import PenIcon from '../img/pen.png'
import ActionBar, {ActionButton} from "./ActionBar";
import {Add} from "./svgs";
import {green, lightBlue} from "../utils/colors";


export default class Main extends React.PureComponent {
    state = {
        points: [],
        polygons: [],
        editMode: false,
        mouse: {
            x: 0,
            y: 0
        },
        pointClicked: {
            index: null,
            polygonIndex: null
        }
    };

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

    onMouseMove = e => {
        const {x, y} = this.getCoordinates(e);
        this.setState(({mouse}) => ({
            mouse: {
                ...mouse,
                x: Math.round(x / 10) * 10,
                y: Math.round(y / 10) * 10
            }
        }));
        // this.setState(({polygons, pointClicked: {index, polygonIndex}}) => {
        //     if(index === null)
        //         return {
        //             mouse: {x, y}
        //         };
        //
        //     polygons[polygonIndex].points[index] = {
        //         x: Math.round(x / 10) * 10,
        //         y: Math.round(y / 10) * 10
        //     };
        //
        //     polygons[polygonIndex] = {
        //         points: [...polygons[polygonIndex].points]
        //     };
        //
        //     return {
        //         polygons: [...polygons]
        //     }
        // });
    };

    onMouseUp = () => this.setState(({mouse}) => ({
        // pointClicked: {
        //     index: null,
        //     polygonIndex: null
        // }
        mouse: {
            ...mouse,
            down: false
        }
    }));

    onMouseDown = e => {
        e.preventDefault();
        this.setState(({mouse}) => ({
            mouse: {
                ...mouse,
                down: true
            }
        }));
    };

    onClick = e => {
        e.stopPropagation();
        const {x, y} = this.getCoordinates(e);
        this.clickTimeout = setTimeout(() => {
            this.setState(({points, editMode}) => {
                if(!editMode)
                    return null;
                return {
                    points: points.concat({
                        x: Math.round(x / 10) * 10,
                        y: Math.round(y / 10) * 10
                    })
                }
            })
        }, 100)
    };

    onDoubleClick = e => {
        e.preventDefault();
        clearTimeout(this.clickTimeout);
        this.setState(({polygons, points}) => ({
            editMode: false,
            polygons: polygons.concat({
                points
            }),
            points: []
        }))
    };

    getPolygons = (polygonIndex, pointIndex, polygons) => this.setState(({polygons, mouse: {x, y}}) => {
        polygons[polygonIndex].points[pointIndex] = {x, y};
        polygons[polygonIndex] = {
            points: [...polygons[polygonIndex].points]
        };
        return {
            polygons: [...polygons]
        }
    });

    onPointChange = (polygonIndex, pointIndex) => this.setState(({polygons, mouse: {x, y}}) => {
        polygons[polygonIndex].points[pointIndex] = {x, y};
        polygons[polygonIndex] = {
            points: [...polygons[polygonIndex].points]
        };
        return {
            polygons: [...polygons]
        }
    });

    onPolygonChange = (index, polygon) => {
        this.setState(({polygons}) => ({
            polygons: polygons.map((p, i) => i !== index ? p : polygon)
        }));
    };


    render() {
        const {points, editMode, mouse, polygons} = this.state;
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
                cursor: editMode && `crosshair`,
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
                        onClick={() => this.setState({editMode: true})}
                    />
                </ActionBar>
                <div style={styles.svgContainer}>
                    <svg
                        viewBox="0 0 1000 1000"
                        style={styles.svg}
                        onClick={this.onClick}
                        onMouseMove={this.onMouseMove}
                        onMouseDown={this.onMouseDown}
                        // onMouseUp={() => this.setState({editMode: false})}
                        ref={this.ref}
                        onDoubleClick={this.onDoubleClick}
                        onMouseUp={this.onMouseUp}
                    >
                        <Grid lines={100} step={10}/>
                        <polyline
                            points={points.concat(mouse).map(({x, y}) => `${x} ${y}`).join(',')}
                            fill="none"
                            stroke="darkcyan"
                        />
                        {polygons.map((polygon, i) => (
                            <Polygon
                                key={i}
                                points={polygon.points}
                                onPointMouseDown={index => this.setState({pointClicked: {index, polygonIndex: i}})}
                                mouse={mouse}
                                onChange={polygon => this.onPolygonChange(i, polygon)}
                            />
                        ))}
                    </svg>
                </div>
            </div>
        );
    }
}

class Polygon extends React.PureComponent {
    static propTypes = {
        points: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        })).isRequired,
        onPointMouseDown: PropTypes.func.isRequired
    };

    state = {
        pointClicked: null
    };

    componentDidUpdate(prevProps) {
        const {mouse} = this.props;
        const {pointClicked} = this.state;
        if(!mouse.down && prevProps.mouse.down)
            this.setState({pointClicked: null});
        else if(pointClicked !== null && mouse !== prevProps.mouse)
            this.onPointChange();
    }

    onPointChange = () => {
        const {onChange, points, mouse: {x, y}} = this.props;
        const {pointClicked} = this.state;
        onChange({
            points: points.map((point, i) => i !== pointClicked ? point : {
                x, y
            })
        })
    };


    render() {
        const {points, onPointMouseDown} = this.props;
        const {pointClicked} = this.state;
        return (
            <g>
                <polygon
                    points={points.map(({x, y}) => `${x} ${y}`).join(' ')}
                    stroke="#ddd"
                    // strokeWidth="1"
                    fill={green}
                    style={{pointerEvents: 'all'}}
                />
                {points.map(({x, y}, i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="white"
                        stroke="#777"
                        onMouseDown={() => this.setState({pointClicked: i})}
                        style={{cursor: '-webkit-grab'}}
                    />
                ))}
            </g>
        )
    }
}

const Grid = ({lines, step}) => Array.from({length: lines - 1}, (_, i) => (
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