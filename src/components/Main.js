import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import ActionBar, {ActionButton} from "./ActionBar";
import {Add, Delete, Square, Text as TextIcon} from "./svgs";
import {green, lightBlue} from "../utils/colors";
import {v4} from 'uuid'
import {polygonType} from "../utils/types";
import * as ReactDOM from "react-dom";
import Input from "./Input";
import Radium from "radium";

const SvgContext = React.createContext();

export default class Main extends React.PureComponent {
    state = {
        figures: [],
        selectedFigureIds: [],
        addMode: null
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.forceUpdate());
        window.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.forceUpdate());
        window.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = ({key}) => {
        if(key === 'Escape')
            this.setState({addMode: null})
    };

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

    selectFigure = id => {
        this.setState(({selectedFigureIds}) =>
            selectedFigureIds.includes(id)
                ? null
                : {
                    selectedFigureIds: selectedFigureIds.concat(id)
                }
        )
    };

    addPolygon = points => {
        this.setState(({figures}) => ({
            addMode: null,
            figures: figures.concat({
                id: v4(),
                color: green,
                type: 'polygon',
                points
            }),
        }))
    };

    onFigureChange = polygon => {
        this.setState(({figures}) => ({
            figures: figures.map(
                f => f.id !== polygon.id ? f : polygon
            )
        }));
    };

    onFigureDelete = id => {
        this.setState(({figures}) => ({
            figures: figures.filter(
                f => f.id !== id
            )
        }));
    };

    addText = ({x, y}) => {
        this.setState(({figures}) => ({
            addMode: null,
            figures: figures.concat({
                id: v4(),
                type: 'text',
                color: 'black',
                value: 'Texto',
                x,
                y
            }),
        }))
    };

    render() {
        const {addMode, figures, selectedFigureIds} = this.state;
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
                borderLeft: '1px solid #ddd',
                overflow: 'auto'
            },
            polygonRow: {
                borderBottom: '1px solid #ddd',
                padding: 10
            }
        };
        return (
            <div style={styles.container}>
                <ActionBar>
                    <ActionButton
                        label="Nueva sección"
                        icon={<Add/>}
                        onClick={() => this.setState({addMode: 'polygon'})}
                    />
                    <ActionButton
                        label="Cuadrado"
                        icon={<Square/>}
                        onClick={() => this.setState({addMode: 'square'})}
                    />
                    <ActionButton
                        label="Texto"
                        icon={<TextIcon/>}
                        onClick={() => this.setState({addMode: 'text'})}
                    />
                </ActionBar>
                <div style={styles.mainContainer}>
                    <SvgContext.Provider value={this.svg}>
                        <div
                            style={styles.svgContainer}
                            onClick={() => this.setState({selectedFigureIds: []})}
                        >
                            <svg
                                viewBox="0 0 1000 1000"
                                style={styles.svg}
                                ref={this.ref}
                            >
                                <Grid lines={100} step={10}/>
                                {addMode === 'square' && (
                                    <SquareCreator
                                        onSuccess={this.addPolygon}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {addMode === 'polygon' && (
                                    <PolygonCreator
                                        onSuccess={this.addPolygon}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {addMode === 'text' && (
                                    <TextCreator
                                        onSuccess={this.addText}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {figures.map(figure =>
                                    figure.type === 'polygon' ? (
                                        <Polygon
                                            key={figure.id}
                                            polygon={figure}
                                            onChange={figure => this.onFigureChange(figure)}
                                            getCoordinates={this.getCoordinates}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            onClick={() => this.selectFigure(figure.id)}
                                        />
                                    ) : figure.type === 'text' && (
                                        <Text
                                            key={figure.id}
                                            text={figure}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            onClick={() => this.selectFigure(figure.id)}
                                            getCoordinates={this.getCoordinates}
                                        />
                                    )
                                )}
                            </svg>
                        </div>
                    </SvgContext.Provider>
                    <div style={styles.sidebar}>
                        {figures.map((figure, i) => (
                            <FigureRow
                                key={figure.id}
                                index={i}
                                selected={selectedFigureIds.includes(figure.id)}
                                onClick={() => this.selectFigure(figure.id)}
                                onDelete={() => this.onFigureDelete(figure.id)}
                            >
                                {figure.type === 'polygon' ? (
                                    <PolygonRow
                                        polygon={figure}
                                        onChange={this.onFigureChange}
                                    />
                                ) : figure.type === 'text' && (
                                    <TextRow
                                        text={figure}
                                        onChange={this.onFigureChange}
                                    />
                                )}
                            </FigureRow>
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

const DeleteButton = Radium(Delete);

const FigureRow = ({style, children, index, selected, onDelete, ...props}) => {
    const _onDelete = e => {
        e.stopPropagation();
        onDelete()
    };
    const styles = {
        container: {
            borderBottom: '1px solid #ddd',
            padding: 10,
            background: selected && '#eee',
            cursor: 'pointer',
            ...props
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        button: {
            fill: '#999',
            ':hover': {
                fill: '#333'
            }
        }
    };

    return (
        <div
            style={styles.container}
            {...props}
        >
            <div style={styles.header}>
                <div>{`Figura ${index + 1}`}</div>
                <DeleteButton
                    onClick={_onDelete}
                    style={styles.button}
                />
            </div>
            {children}
        </div>
    )
};


const PolygonRow = ({polygon, onChange}) => (
    <Input
        label="Color"
        value={polygon.color}
        type="color"
        onChange={(e, color) => onChange(({
            ...polygon,
            color
        }))}
    />
);

PolygonRow.propTypes = {
    polygon: polygonType.isRequired,
    onChange: PropTypes.func.isRequired
};

const TextRow = ({text, onChange}) => (
    <Input
        label="Texto"
        value={text.value}
        onChange={(e, value) => onChange(({
            ...text,
            value
        }))}
    />
);

class Text extends React.PureComponent {
    static propTypes = {
        text: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            value: PropTypes.string.isRequired,
        }),
        getCoordinates: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
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

    onClick = e => {
        e.stopPropagation();
        const {onClick} = this.props;
        onClick(e)
    };

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
        const {text, selected} = this.props;
        const {
            x,
            y,
            width,
            height
        } = this.text ? this.text.getBBox() : {};
        const styles = {
            text: {
                cursor: 'pointer'
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
                    onClick={this.onClick}
                    ref={text => this.text = text}
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

class TextCreator extends React.PureComponent {
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

class SquareCreator extends React.PureComponent {
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

class Polygon extends React.PureComponent {
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
        dragging: false,
        dragStartX: 0,
        dragStartY: 0
    };

    componentDidMount() {
        this.forceUpdate();
        console.log('ds')
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
        const {getCoordinates, onClick} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState({
            dragging: true,
            dragStartX: x,
            dragStartY: y,
            x,
            y
        });
        onClick(e);
    };

    render() {
        const {polygon, getCoordinates, selected} = this.props;
        const {pointClicked, x, y, dragging, dragStartX, dragStartY} = this.state;

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
                    points={points.map(({x, y}) => `${x} ${y}`).join(' ')}
                    style={styles.polygon}
                    onMouseDown={this.onDragStart}
                />
                {selected && points.map(({x, y}, i) => (
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
                {(pointClicked !== null || dragging) && (
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