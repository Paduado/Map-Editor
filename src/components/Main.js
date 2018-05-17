import React from 'react';
import PropTypes from 'prop-types'
import PenIcon from '../img/pen.png'


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

    getRelativeCoordinates = e => {
        const {clientX: X, clientY: Y} = e;
        this.point.x = X;
        this.point.y = Y;
        const {x, y} = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
        return {x, y};
    };

    onMouseMove = e => {
        const {x, y} = this.getRelativeCoordinates(e);
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
        const {x, y} = this.getRelativeCoordinates(e);
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

    onPolygonChange = (index, polygon) => this.setState(({polygons}) => ({
        polygons: polygons.map((p, i) => i !== index ? p : polygon)
    }));


    render() {
        const {points, editMode, mouse, polygons} = this.state;
        const styles = {
            svg: {
                display: 'block',
                border: '1px solid #ddd',
                cursor: editMode && `crosshair`
            }
        };
        return (
            <div>
                <button onClick={() => this.setState({editMode: true})}>Edit</button>
                <svg
                    width="1000px"
                    height="1000px"
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
                    stroke="darkcyan"
                    strokeWidth="1"
                    fill="#eef"
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

const Grid = ({lines, step}) => Array(lines - 1).fill().map((_, i) => (
    <React.Fragment key={i}>
        <line
            x1="0"
            x2="1000"
            y1={(i + 1) * step}
            y2={(i + 1) * step}
            stroke="#dde"
            strokeWidth="1"
        />
        <line
            x1={(i + 1) * step}
            x2={(i + 1) * step}
            y1="0"
            y2="1000"
            stroke="#dde"
            strokeWidth="1"
        />
    </React.Fragment>
));